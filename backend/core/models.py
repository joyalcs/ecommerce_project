from django.db import models
from shortuuid.django_fields import ShortUUIDField
from django.utils.html import mark_safe
from users.models import User
from django.utils import timezone

# Create your models here.

class Category(models.Model):
    cid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="cat")
    name = models.CharField(max_length=100)
    image = models.ImageField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self) -> str:
        return self.name

class Product(models.Model):
    pid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="pro")

    seller =  models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    image = models.ImageField(null=True, blank=True)
    brand = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True,default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    offer_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    stock_count = models.IntegerField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add= True)

    def __str__(self) -> str:
        return self.name

    def product_image(self):
        return mark_safe('<img src="%s" width="50" height="50" />' % (self.image.url))

    class Meta:
        verbose_name_plural = "Products"

class ProductImages(models.Model):
    images = models.ImageField(null=True, blank=True)
    product = models.ForeignKey(Product, related_name="p_images", on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Product Images"

class Review(models.Model):
    rid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="rev")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True)
    comment = models.TextField(null=True,blank=True)
    createdAt = models.DateTimeField(auto_now_add= True)

    def __str__(self) -> str:
        return self.rating




class ShippingAddress(models.Model):
    shid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="ship")

    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    phone_number = models.BigIntegerField(default=+91)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    createdAt = models.DateTimeField(auto_now_add= True)

    def __str__(self):
        self.address


class Order(models.Model):
    oid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="ord")

    user = models.ForeignKey(User, on_delete=models.CASCADE, default='0')
    shippingAddress = models.ForeignKey(ShippingAddress, on_delete=models.CASCADE, default='0')
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2,default=0)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    isDelivered = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add= True)



class OrderItem(models.Model):
    oiid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="orditem")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, default=0)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, related_name='order_items')
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        self.name

class Transactions(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    payment_id = models.CharField(max_length=200, verbose_name="Payment ID")
    razorpay_order_id = models.CharField(max_length=200, verbose_name="Order ID")
    signature = models.CharField(max_length=500, verbose_name="Signature", blank=True, null=True)
    paidAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        self.transid
