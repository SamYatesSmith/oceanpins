from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, Profile, Dive

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = CustomUser
        fields = ("username", "email", "first_name", "last_name", "profile_pic", "password1", "password2")

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        if commit:
            user.save()
        return user

class ProfileForm(forms.ModelForm):
    next_dive_trip_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}))

    class Meta:
        model = Profile
        fields = [
            'dive_school', 'cert_level', 'fav_dive_site', 
            'next_dive_trip_date', 'next_dive_location', 
            'training_location', 'biography', 'profile_pic'
        ]
        widgets = {
            'dive_school': forms.Select(attrs={'class': 'form-control'}),
            'cert_level': forms.TextInput(attrs={'class': 'form-control'}),
            'fav_dive_site': forms.TextInput(attrs={'class': 'form-control'}),
            'next_dive_location': forms.TextInput(attrs={'class': 'form-control'}),
            'training_location': forms.TextInput(attrs={'class': 'form-control'}),
            'biography': forms.Textarea(attrs={'class': 'form-control'}),
        }

class DiveForm(forms.ModelForm):
    class Meta:
        model = Dive
        fields = ['title', 'description', 'image']