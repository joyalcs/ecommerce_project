# Generated by Django 4.2.4 on 2023-11-05 15:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_cart_cartitems"),
    ]

    operations = [
        migrations.RenameField(
            model_name="cart",
            old_name="cartid",
            new_name="cid",
        ),
    ]
