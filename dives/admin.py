from django.contrib import admin
from .models import DiveLog


@admin.register(DiveLog)
class DiveLogAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'location', 'buddy', 'depth')
    search_fields = ('name', 'location', 'buddy')
    list_filter = ('date', 'location')


