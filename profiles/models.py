from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_pic = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True
    )

    @property
    def profile(self):
        return Profile.objects.get(user=self)


class Profile(models.Model):
    PADI = 'PADI'
    SSI = 'SSI'
    DIVE_SCHOOL_CHOICES = [
        (PADI, 'PADI'),
        (SSI, 'SSI'),
    ]

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    dive_school = models.CharField(
        max_length=100,
        choices=DIVE_SCHOOL_CHOICES,
        blank=True,
        null=True
    )
    cert_level = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    fav_dive_site = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    next_dive_trip_date = models.DateField(
        blank=True,
        null=True
    )
    next_dive_location = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    training_location = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    biography = models.TextField(
        blank=True,
        null=True
    )
    profile_pic = CloudinaryField(
        'image',
        default=(
            'https://res.cloudinary.com/dt6dg1u1o/image/upload/v1716999970/'
            'static/images/user_default.png'
        )
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Dive(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = CloudinaryField('image')

    def __str__(self):
        return self.title
