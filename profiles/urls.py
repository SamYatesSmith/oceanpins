from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('profile-setup/', views.profile_setup, name='profile_setup'),
    path('profile-picture-upload/', views.profile_picture_upload, name='profile_picture_upload'),
]