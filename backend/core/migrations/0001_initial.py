# Generated by Django 4.2.4 on 2023-11-03 18:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shortuuid.django_fields


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "cid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        length=10,
                        max_length=20,
                        prefix="cat",
                        unique=True,
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("image", models.ImageField(blank=True, null=True, upload_to="")),
            ],
            options={
                "verbose_name_plural": "Categories",
            },
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "oid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        length=10,
                        max_length=20,
                        prefix="ord",
                        unique=True,
                    ),
                ),
                (
                    "paymentMethod",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                ("taxPrice", models.DecimalField(decimal_places=2, max_digits=7)),
                (
                    "shippingPrice",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=7, null=True
                    ),
                ),
                (
                    "totalPrice",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=7, null=True
                    ),
                ),
                ("isPaid", models.BooleanField(default=False)),
                ("paidAt", models.DateTimeField()),
                ("isDelivered", models.BooleanField(default=False)),
                ("deliveredAt", models.DateTimeField(blank=True, null=True)),
                ("createdAt", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "pid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        length=10,
                        max_length=20,
                        prefix="pro",
                        unique=True,
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("image", models.ImageField(blank=True, null=True, upload_to="")),
                ("brand", models.CharField(max_length=100)),
                ("description", models.TextField(max_length=300)),
                (
                    "rating",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=7, null=True
                    ),
                ),
                ("numReviews", models.IntegerField(blank=True, default=0, null=True)),
                ("price", models.DecimalField(decimal_places=2, max_digits=7)),
                (
                    "offer_price",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=7, null=True
                    ),
                ),
                ("stock_count", models.IntegerField(blank=True, null=True)),
                ("createdAt", models.DateTimeField(auto_now_add=True)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.category"
                    ),
                ),
                (
                    "seller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Products",
            },
        ),
        migrations.CreateModel(
            name="ShippingAddress",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "shid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        length=10,
                        max_length=20,
                        prefix="ship",
                        unique=True,
                    ),
                ),
                ("address", models.CharField(blank=True, max_length=200, null=True)),
                ("city", models.CharField(blank=True, max_length=200, null=True)),
                ("postalCode", models.CharField(blank=True, max_length=200, null=True)),
                ("country", models.CharField(blank=True, max_length=200, null=True)),
                (
                    "shippingPrice",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=7, null=True
                    ),
                ),
                ("createdAt", models.DateTimeField(auto_now_add=True)),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.order"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "rid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        length=10,
                        max_length=20,
                        prefix="rev",
                        unique=True,
                    ),
                ),
                ("name", models.CharField(blank=True, max_length=200, null=True)),
                ("rating", models.IntegerField(blank=True, null=True)),
                ("comment", models.TextField(blank=True, null=True)),
                ("createdAt", models.DateTimeField(auto_now_add=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.product"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ProductImages",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("images", models.ImageField(blank=True, null=True, upload_to="")),
                ("createdAt", models.DateTimeField(auto_now_add=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="p_images",
                        to="core.product",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Product Images",
            },
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "oiid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        length=10,
                        max_length=20,
                        prefix="orditem",
                        unique=True,
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("qty", models.IntegerField(blank=True, default=0, null=True)),
                ("price", models.DecimalField(decimal_places=2, max_digits=7)),
                ("image", models.CharField(blank=True, max_length=200, null=True)),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.order"
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.product"
                    ),
                ),
            ],
        ),
    ]
