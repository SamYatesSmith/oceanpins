from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


# Models
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('bio', 'profile_pic')}),
)

admin.site.register(CustomUser, CustomUserAdmin)
