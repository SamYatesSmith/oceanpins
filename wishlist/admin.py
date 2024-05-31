from django.contrib import admin
from .models import Wishlist

# Register your models here.

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'description')
    search_fields = ['location']
    list_filter = ('user', )

