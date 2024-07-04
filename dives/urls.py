from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login_signup_choice/', views.login_signup_choice, name='login_signup_choice'),
    path('add_dive_log/', views.add_dive_log, name='add_dive_log'),
    path('view_dive_logs/', views.view_dive_logs, name='view_dive_logs'),
    path('update_dive_log/', views.update_dive_log, name='update_dive_log'),
    path('remove_dive_log/', views.remove_dive_log, name='remove_dive_log'),
    path('interactive_map/', views.interactive_map, name='interactive_map'),
    path('profile/', views.profile_view, name='profile'),
    path('get_divelog_markers/', views.get_divelog_markers, name='get_divelog_markers'),
]