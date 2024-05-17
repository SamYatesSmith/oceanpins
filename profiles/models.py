from django.db import models
from Django.contrib.auth.models import User


# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_pic = models.ImageToField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username
