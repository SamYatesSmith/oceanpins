# profiles/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib import messages
from .forms import CustomUserCreationForm, ProfileForm
from .models import Profile
import logging

logger = logging.getLogger(__name__)

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            # Automatically log the user in after registration
            login(request, user)
            # Create a profile for the new user
            profile = Profile.objects.create(user=user)
            if profile:
                logger.info(f"Profile created for user: {user.username}")
            else:
                logger.error("Profile creation failed")
            messages.success(request, 'Success - Your account has been created. Please complete your profile.')
            return redirect('profile_setup')
        else:
            logger.error("Form is not valid: %s", form.errors)
    else:
        form = CustomUserCreationForm()
    return render(request, 'profiles/register.html', {'form': form})

@login_required
def profile_setup(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user.user_profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile')
    else:
        form = ProfileForm(instance=request.user.user_profile)
    return render(request, 'profiles/profile_setup.html', {'form': form})

@login_required
def profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'profile.html', {'form': form})
