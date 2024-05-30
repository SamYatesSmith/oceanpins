from django.contrib import admin
from .models import Dive, DiveLog


# Register your models here.


@admin.register(Dive)
class DiveAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'date', 'depth')
    search_fields = ('location', 'buddy')
    list_filter = ('date', 'user')

@admin.register(DiveLog)
class DiveLogAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'location', 'buddy', 'depth')
    search_fields = ('name', 'location', 'buddy')
    list_filter = ('date', 'location')