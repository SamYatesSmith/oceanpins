from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Dive(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    date = models.DateField()
    depth = models.FloatField()
    buddy = models.CharField(max_length=255)
    conditions = models.TextField()
    photos = models.ImageField(upload_to='dive_photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.location} - {self.date}"

class DiveLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    buddy = models.CharField(max_length=255)
    depth = models.FloatField()
    temp = models.FloatField()
    visibility = models.FloatField()
    bottom_time = models.FloatField()

    def __str__(self):
        return self.name