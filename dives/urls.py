from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from .views import add_dive_log, add_dive, view_dive_logs, view_dives, get_most_common_buddy, interactive_map, add_marker

urlpatterns = [
    path('home/', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login_signup_choice/', views.login_signup_choice, name='login_signup_choice'),
    path('add_dive/', add_dive, name='add_dive'),
    path('add_dive_log/', add_dive_log, name='add_dive_log'),
    path('view_dive_logs/', view_dive_logs, name='view_dive_logs'),
    path('view_dives/', view_dives, name='view_dives'),
    path('most_common_buddy/', get_most_common_buddy, name='most_common_buddy'),
    path('add_marker/', views.add_marker, name='add_marker'),
    path('interactive_map/', views.interactive_map, name='interactive_map'),
]