# Generated by Django 4.2.4 on 2023-11-06 06:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_remove_cart_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cartitems',
            name='cart',
        ),
        migrations.RemoveField(
            model_name='cartitems',
            name='product',
        ),
        migrations.DeleteModel(
            name='Cart',
        ),
        migrations.DeleteModel(
            name='CartItems',
        ),
    ]
