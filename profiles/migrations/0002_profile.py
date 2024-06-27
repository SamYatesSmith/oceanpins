# Generated by Django 3.2.25 on 2024-06-26 16:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dive_school', models.CharField(blank=True, choices=[('PADI', 'PADI'), ('SSI', 'SSI')], max_length=100, null=True)),
                ('cert_level', models.CharField(blank=True, max_length=100, null=True)),
                ('fav_dive_site', models.CharField(blank=True, max_length=100, null=True)),
                ('next_dive_trip_date', models.DateField(blank=True, null=True)),
                ('next_dive_location', models.CharField(blank=True, max_length=100, null=True)),
                ('training_location', models.CharField(blank=True, max_length=100, null=True)),
                ('biography', models.TextField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
