from django.db import models
from Django.contrib.auth.models import User


# Create your models here.


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    description = models.TextField()