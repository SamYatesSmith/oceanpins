# Generated by Django 3.2.25 on 2024-07-03 15:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_profile_map_snapshot_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='map_snapshot_url',
        ),
    ]
