# Generated by Django 3.2.25 on 2024-06-20 11:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dives', '0003_auto_20240619_1628'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='marker',
            name='user',
        ),
        migrations.DeleteModel(
            name='Dive',
        ),
        migrations.DeleteModel(
            name='Marker',
        ),
    ]
