from django.db import models
from django.conf import settings


class DiveLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    date = models.DateField()
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, db_index=True)
    buddy = models.CharField(max_length=255)
    depth = models.FloatField()
    temp = models.FloatField()
    visibility = models.FloatField()
    bottom_time = models.FloatField()

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dives_profile'
    )


def __str__(self):
    return self.user.username
