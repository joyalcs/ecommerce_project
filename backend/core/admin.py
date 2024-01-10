from django.contrib import admin
from .models import Category, Product, ProductImages
from .models import Order, OrderItem, ShippingAddress, Review


# Register your models here.
class ProductImagesAdmin(admin.TabularInline):
    model = ProductImages


class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImagesAdmin]


admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Review)
# admin.site.register(Cart)
# admin.site.register(CartItems)
