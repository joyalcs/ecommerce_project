# Generated by Django 4.2.4 on 2023-11-10 14:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("core", "0011_alter_shippingaddress_phone_number"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="order",
            name="deliveredAt",
        ),
        migrations.RemoveField(
            model_name="order",
            name="paymentMethod",
        ),
        migrations.RemoveField(
            model_name="orderitem",
            name="order",
        ),
        migrations.AddField(
            model_name="order",
            name="items",
            field=models.ForeignKey(
                default="0",
                on_delete=django.db.models.deletion.CASCADE,
                to="core.orderitem",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="paymentId",
            field=models.CharField(default="0", max_length=200),
        ),
        migrations.AddField(
            model_name="order",
            name="shippingAddress",
            field=models.ForeignKey(
                default="0",
                on_delete=django.db.models.deletion.CASCADE,
                to="core.shippingaddress",
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="shippingPrice",
            field=models.DecimalField(
                blank=True, decimal_places=2, default=0, max_digits=7, null=True
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="taxPrice",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=7),
        ),
        migrations.AlterField(
            model_name="order",
            name="user",
            field=models.ForeignKey(
                default="0",
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="orderitem",
            name="product",
            field=models.ForeignKey(
                default=0,
                on_delete=django.db.models.deletion.CASCADE,
                to="core.product",
            ),
        ),
    ]
