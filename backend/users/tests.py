from users.serializers import SendPasswordResetEmailSerializer
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from unittest.mock import patch

class RegisterSeralizerTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-register')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'testuser@gmail.com',
            'first_name': 'test',
            'last_name': 'user',
            'password': 'testpass@123',
            'password2' : 'testpass@123',
        }

    def test_valid_registration(self):
        """Test for valid registration"""
        response = self.client.post(self.register_url, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_invalid_password(self):
        """Test for an invalid password"""
        payload = {
            'username': 'testuser',
            'email': 'testuser@gmail.com',
            'first_name': 'test',
            'last_name': 'user',
            'password': 'testpass@123',
            'password2' : 'test@123',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_invalid_email(self):
        """Test for an invalid email when register a user"""
        payload = {
            'username': 'testuser',
            'email': 'testuser',
            'first_name': 'test',
            'last_name': 'user',
            'password': 'testpass@123',
            'password2' : 'testpass@123',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_empty(self):
        """"Test for creating a user with empty values"""
        payload = {
            'username': '',
            'email': '',
            'first_name': '',
            'last_name': '',
            'password': '',
            'password2' : '',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_common_password(self):
        """Test for creating a user with common password"""
        payload = {
            'username': 'testuser',
            'email': 'testuser',
            'first_name': 'test',
            'last_name': 'user',
            'password': 'testpass',
            'password2' : 'testpass',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserProfileViewTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )
        self.url = reverse('user-profile')
        self.client.force_authenticate(user=self.user)


    def test_user_profile_view_authenticated(self):
        """Test for view the profile by an authenticated user"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.id)
        self.assertEqual(response.data['username'], self.user.username)

    def test_user_profile_view_unauthenticated(self):
        """Test for view the profile by an unauthenticated user"""
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class UserChangePasswordTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username = 'testuser',
            email = 'test@gmail.com',
            password = 'testpass@123',
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse('change-password')

    def test_change_password_successfully(self):
        """Test for change password successfully"""
        payload = {
            'password': 'newpass@123',
            'password2': 'newpass@123',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass@123'))

    def test_change_password_mismatch(self):
        """Test Mismatch password"""
        payload = {
            'password': 'newpass@123',
            'password2': 'newpass@12',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_unauthorized(self):
        """Test for try to change password by an unauthorized user"""
        self.client.logout()
        payload = {
            'password': 'newpass@123',
            'password2': 'newpass@123',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class SendPasswordResetEmailSerializerTest(APITestCase):
    @patch('users.utils.Util.send_email')
    def test_send_password_reset_email(self, mock_send_email):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )

        data = {'email': 'test@example.com'}

        serializer = SendPasswordResetEmailSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid, f"Serializer validation failed: {serializer.errors}")

        uid = str(self.user.id)
        token = PasswordResetTokenGenerator().make_token(self.user)

        mock_send_email.assert_called_once_with({
            'subject': 'Reset Your Password',
            'body': 'Hai, You can click the link for reset the password http://localhost:3000/api/users/reset/{}/{}'.format(uid, token),
            'to_email': 'test@example.com'
        })

class UserResetPasswordSerializerTest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username = 'testuser',
            email = 'test@gmail.com',
            password = 'testpass@123',
        )


    def test_successful_reset_password(self):
        """Test for resetting the password successfully through email link"""
        uid = str(self.user.id)
        token = PasswordResetTokenGenerator().make_token(self.user)
        payload = {
            'password': 'newpass@123',
            'password2': 'newpass@123',
        }
        url = reverse('reset-password', kwargs={'uid': uid, 'token':token})
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass@123'))

    def test_change_password_mismatch(self):
        """Test Mismatch password"""
        uid = str(self.user.id)
        token = PasswordResetTokenGenerator().make_token(self.user)
        payload = {
            'password': 'newpass@123',
            'password2': 'newpass@12',
        }
        url = reverse('reset-password', kwargs={'uid': uid, 'token':token})
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_mismatch(self):
        """Test for invalid token"""
        uid = str(self.user.id)
        token = 'invalidtoken'
        payload = {
            'password': 'newpass@123',
            'password2': 'newpass@12',
        }
        url = reverse('reset-password', kwargs={'uid': uid, 'token':token})
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
