from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from core.models import Category, Product

class CategoriesTestCase(APITestCase):
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

