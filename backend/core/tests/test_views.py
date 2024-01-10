from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from core.models import Category, Product, Review, ShippingAddress, Order


class CategoriesProductsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )
        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product',
                                              category= self.category,
                                              price=10.00,
                                              seller = self.user,
                                              brand = 'Test Brand',
                                              description = 'Test Description'
                                            )

    def test_categories_list(self):
        """Test for list all categories"""
        url = reverse('all-categories')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_products_basis_of_category(self):
        """"Test for retrieve all products on the basis of categories"""
        url = reverse('category-products', kwargs={'cid': self.category.cid})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_all_products(self):
        """Test for lisrt all products"""
        url = reverse('all-products')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_product(self):
        """"Test for retrieve a products on the basis of id"""
        url = reverse('pid-product', kwargs={'pid': self.product.pid})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_product_by_search(self):
        """"Test for retrieve a products on the basis of id"""
        name = 'Te'
        url = f'http://localhost:3000/api/products/?name={name}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ReviewsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )
        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product',
                                              category= self.category,
                                              price=10.00,
                                              seller = self.user,
                                              brand = 'Test Brand',
                                              description = 'Test Description'
                                            )
        self.client.force_authenticate(user=self.user)

    def test_post_review(self):
        """Test for post a review successfully"""
        payload = {
            'user': self.user.id,
            'product': self.product.pid,
            'rating': 4,
            'review': "Good Product"
        }
        url = reverse('review-post')
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        self.assertEqual(Review.objects.first().user, self.user)
        self.assertEqual(Review.objects.first().product, self.product)

    def test_duplicate_review(self):
        """Test for post a review from same user"""
        # self.client.force_authenticate(user=self.user)
        payload = {
            'user': self.user.id,
            'product': self.product.pid,
            'rating': 4,
            'review': "Good Product"
        }
        url = reverse('review-post')
        #first review from the user
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        #second review from the user
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_review(self):
        """Test for view a review"""
        url = reverse('product-review', kwargs={"pid":self.product.pid})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShippingAddressTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )
        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product',
                                              category= self.category,
                                              price=10.00,
                                              seller = self.user,
                                              brand = 'Test Brand',
                                              description = 'Test Description'
                                            )
        self.client.force_authenticate(user=self.user)


    def test_add_shipping_address(self):
        """Test for adding a shipping address by authenticated user"""
        payload = {
            'user': self.user.id,
            'address': "Test Address",
            'city': "Test City",
            'postalCode':1234,
            'country': 'Test Country',
            'phone_number': 123456778,
        }
        url = reverse('shipping-address')
        response = self.client.post(url,payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_view_shipping_address(self):
        """Test for view the shipping address"""
        payload = {
            'user': self.user.id,
            'address': "Test Address",
            'city': "Test City",
            'postalCode':1234,
            'country': 'Test Country',
            'phone_number': 123456778,
        }
        #save a shipping address
        url = reverse('shipping-address')
        response = self.client.post(url,payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        shipping_address_id = response.data.get('shid', None)
        self.assertIsNotNone(shipping_address_id)

        #view all shipping address by the user
        url = reverse('shipping-address-get', kwargs={'shid': shipping_address_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_shipping_address_by_unauthenticated_user(self):
        """Test for adding a shipping address by unauthenticated user"""
        self.client.logout()
        payload = {
            'user': self.user.id,
            'address': "Test Address",
            'city': "Test City",
            'postalCode':1234,
            'country': 'Test Country',
            'phone_number': 123456778,
        }
        url = reverse('shipping-address')
        response = self.client.post(url,payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class OrderTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )
        self.category = Category.objects.create(name='Test Category')
        self.product = Product.objects.create(name='Test Product',
                                              category= self.category,
                                              price=10.00,
                                              seller = self.user,
                                              brand = 'Test Brand',
                                              description = 'Test Description',
                                              image = "image.jpg",
                                              stock_count=10
                                            )
        self.address = ShippingAddress.objects.create(
            user= self.user,
            address="Test Address",
            city="Test City",
            postalCode=1234,
            country='Test Country',
            phone_number=123456778,
        )
        self.client.force_authenticate(user=self.user)


    def test_complete_order_successfully(self):
        """Test for complete the order"""
        order_payload = {
            'orderItems': [
                {
                    'product': {'pid': self.product.pid},
                    'cartQuantity': 2,
                    'price': 20.0,
                    'image': self.product.image.url if self.product.image else "Not Found"
                },
            ],
            'shippingAddress': self.address.shid,
            'totalPrice': 40.0,
        }

        url = reverse('order-post')
        response = self.client.post(url, order_payload, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_complete_order_no_products(self):
        """Test for complete the order with no products"""
        order_payload = {
            'orderItems': [
            ],
            'shippingAddress': self.address.shid,
            'totalPrice': 0,
        }

        url = reverse('order-post')
        response = self.client.post(url, order_payload, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_all_orders(self):
        "Test for get all orders"
        url = reverse('orders-get')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_orders_by_unauthenticated_user(self):
        "Test for get all orders"
        self.client.logout()
        url = reverse('orders-get')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class RazorpayPaymentTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass@123',
        )
        self.client.force_authenticate(user=self.user)

    def test_payment_successful(self):
        payload = {
            'amount': 100.0
        }
        url = reverse('razorpay-payment')
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('order_id', response.data)
        self.assertIn('amount', response.data)
        self.assertIn('currency', response.data)
