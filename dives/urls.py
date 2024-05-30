from django.urls import path
from .views import add_dive_log, add_dive

urlpatterns = [
    path('addDive/', add_dive_log, name='add_dive'),
    path('add_dive/', add_dive, name='add_dive'),
]