from django.contrib import admin
from .models import Dive
# Register your models here.

class DiveAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'date', 'depth')
    search_fields = ('location', 'buddy')
    list_filter = ('date', 'user')