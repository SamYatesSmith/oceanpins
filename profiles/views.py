import os
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.http import JsonResponse
from .forms import CustomUserCreationForm, ProfileForm
from .models import Profile
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


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
    user_profile = Profile.objects.get(user=request.user)
    form = ProfileForm(instance=user_profile)

    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=user_profile)
        if form.is_valid():
            form.save()

    return render(request, 'profiles/profile.html', {'form': form, 'profile': user_profile})
