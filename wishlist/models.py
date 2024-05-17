from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return f"{self.location} - {self.user.username}"