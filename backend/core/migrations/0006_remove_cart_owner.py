# Generated by Django 4.2.4 on 2023-11-06 03:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_cart_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cart',
            name='owner',
        ),
    ]
