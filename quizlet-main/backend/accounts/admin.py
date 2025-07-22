from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .forms import *

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    add_form = UserCreationForm
    list_display = ['username', 'full_name', 'email', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': (
                'full_name', 'email'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 'user_permissions'
            )
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        })
    )
    add_fieldsets = (
        (None, {
            'fields': ('username',),
        }),
    )
    list_per_page = 10

# Register your models here.
admin.site.register(User, CustomUserAdmin)
