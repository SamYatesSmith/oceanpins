from django.urls import path
from . import views

urlpatterns = [
    path('addDive/', views.add_dive, name='add_dive'),
]