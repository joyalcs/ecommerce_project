from django.urls import path
from . import views


urlpatterns = [

    path("products/", views.ProductsView.as_view(), name='all-products'),
    path("products/<str:pid>/", views.ProductsView.as_view(), name='pid-product'),
    path("products/?name=name/", views.ProductsView.as_view(), name='name-product'),

    path("reviews/", views.ReviewView.as_view()),
    path("<str:pid>/reviews/", views.ReviewView.as_view()),

    path("categories/", views.CategoriesView.as_view(), name='all-categories'),
    path("categories/<str:cid>/", views.CategoryProductsView.as_view(), name='category-products'),

    path("shippingaddress/", views.ShippingAddressView.as_view()),
    path("shippingaddress/<str:shid>/",views.ShippingAddressView.as_view()),

    path("order/", views.OrderView.as_view()),

    path("payment/", views.RazorpayOrderView.as_view()),
    path("verify/", views.TransactionView.as_view()),

    path("orders/", views.ViewOrdersView.as_view())

]

