from django.urls import path
from . import views


urlpatterns = [

    path("products/", views.ProductsView.as_view()),
    path("products/<str:pid>/", views.ProductsView.as_view()),

    path("categories/", views.CategoriesView.as_view()),
    path("categories/<str:cid>/", views.CategoryProductsView.as_view()),

    path("shippingaddress/", views.ShippingAddressView.as_view()),
    path("shippingaddress/<str:shid>/",views.ShippingAddressView.as_view()),

    path("order/", views.OrderView.as_view()),

    path("transaction/", views.TransactionView.as_view()),

]

