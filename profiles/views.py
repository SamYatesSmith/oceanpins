import os
import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from .forms import CustomUserCreationForm, ProfileForm
from .models import Profile
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)

class CustomLoginView(LoginView):
    template_name = 'profiles/login.html'
    success_url = reverse_lazy('profile')

    def form_invalid(self, form):
        messages.error(self.request, "Invalid username or password. Please try again.")
        return super().form_invalid(form)

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            profile = Profile.objects.create(user=user)
            if profile:
                logger.info(f"Profile created for user: {user.username}")
            else:
                logger.error("Profile creation failed")
            messages.success(request, 'Success - Your account has been created. Please complete your profile.')
            return redirect('profile_setup')
        else:
            for field in form:
                for error in field.errors:
                    messages.error(request, f"{field.label}: {error}")
            for error in form.non_field_errors():
                messages.error(request, error)
            logger.error("Form is not valid: %s", form.errors)
    else:
        form = CustomUserCreationForm()
    return render(request, 'profiles/register.html', {'form': form})

@login_required
def profile_setup(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile')
    else:
        form = ProfileForm(instance=request.user.profile)
    return render(request, 'profiles/profile_setup.html', {'form': form})

@login_required
def profile(request):
    user_profile = Profile.objects.get(user=request.user)
    form = ProfileForm(instance=user_profile)

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile picture updated successfully.')
            return redirect('profile')

    return render(request, 'profiles/profile.html', {'form': form, 'profile': user_profile})

@login_required
def profile_picture_upload(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile picture updated successfully.')
            return redirect('profile')
    else:
        form = ProfileForm(instance=request.user.profile)
    
    return render(request, 'profiles/profile.html', {'form': form})

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user.profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfileForm(instance=request.user.profile)

    return render(request, 'profiles/profile.html', {
        'form': form,
    })