from django.urls import path
from . import views


urlpatterns = [

    path("products/", views.ProductsView.as_view(), name='all-products'),
    path("products/<str:pid>/", views.ProductsView.as_view(), name='pid-product'),
    path("products/?name=name/", views.ProductsView.as_view(), name='name-product'),

    path("reviews/", views.ReviewView.as_view(), name='review-post'),
    path("<str:pid>/reviews/", views.ReviewView.as_view(), name='product-review'),

    path("categories/", views.CategoriesView.as_view(), name='all-categories'),
    path("categories/<str:cid>/", views.CategoryProductsView.as_view(), name='category-products'),

    path("shippingaddress/", views.ShippingAddressView.as_view(), name='shipping-address'),
    path("shippingaddress/<str:shid>/",views.ShippingAddressView.as_view(), name='shipping-address-get'),

    path("order/", views.OrderView.as_view(), name='order-post'),

    path("payment/", views.RazorpayOrderView.as_view(), name='razorpay-payment'),
    path("verify/", views.TransactionView.as_view(), name='transaction'),

    path("orders/", views.ViewOrdersView.as_view(), name='orders-get')

]

