# Generated by Django 4.2.4 on 2023-11-10 15:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_orderitem_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderitem',
            name='image',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='name',
        ),
    ]