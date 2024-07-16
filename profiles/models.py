from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    @property
    def profile(self):
        return Profile.objects.get(user=self)

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    dive_school = models.CharField(max_length=100, blank=True, null=True)
    cert_level = models.CharField(max_length=100, blank=True, null=True)
    fav_dive_site = models.CharField(max_length=100, blank=True, null=True)
    next_dive_trip_date = models.DateField(blank=True, null=True)
    next_dive_location = models.CharField(max_length=100, blank=True, null=True)
    training_location = models.CharField(max_length=100, blank=True, null=True)
    biography = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"