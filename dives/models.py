from django.db import models
from django.conf import settings

# Create your models here.

class Dive(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    date = models.DateField()
    depth = models.FloatField()
    buddy = models.CharField(max_length=255)
    conditions = models.TextField()
    photos = models.ImageField(upload_to='dive_photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.location} - {self.date}"

class DiveLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True) # null = TEMPORARY.
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

print("Loading Marker model...")  # Debug statement

from django.db import models
from django.conf import settings

class Marker(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lat = models.FloatField()
    lng = models.FloatField()

    def __str__(self):
        return f"Marker at {self.lat}, {self.lng}"

print("Marker model loaded.")  # Debug statement