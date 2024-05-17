from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages
from .forms import CustomUserCreationForm


# Create your views here.


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, 'Success - Your account has been created.  Feel free to go ahead and log-in.')
            return redirect('profiles/login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'profiles/register.html', {'form': form})
    