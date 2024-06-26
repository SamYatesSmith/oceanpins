from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import TemplateView
from dives import views as dive_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dive_views.home, name='home'),
    path('dives/', include('dives.urls')),
    path('login/', LoginView.as_view(template_name='profiles/login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='home'), name='logout'),
    path('register/', include('profiles.urls')),
    path('profiles/', include('profiles.urls')),
    path('signup/', TemplateView.as_view(template_name='profiles/signup.html'), name='signup'),
    path('login_signup_choice/', TemplateView.as_view(template_name='profiles/login_signup_choice.html'), name='login_signup_choice'),
]
