# Generated by Django 4.2.4 on 2023-11-09 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_remove_shippingaddress_order_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shippingaddress',
            name='shippingPrice',
        ),
        migrations.AlterField(
            model_name='shippingaddress',
            name='phone_number',
            field=models.IntegerField(default=91),
        ),
    ]
