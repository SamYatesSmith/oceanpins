from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages



# Create your views here.


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Success - Your account has been created.  Feel free to go ahead and log-in.')
            return redirect('profiles/login')
    else:
        form = UserCreationForm()
    return render(request, 'profiles/register.html', {'form': form})
    