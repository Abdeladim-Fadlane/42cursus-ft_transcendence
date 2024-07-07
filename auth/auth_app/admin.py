from django.contrib import admin

# Register your models here.
from .models import CustomUser, all_Match ,Friends ,FriendRequest

# admin.site.register(UserProfile)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserForm
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserForm
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('photo_profile', 'score', 'win', 'lose', 'ranking', 'unigue_id')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('photo_profile', 'score', 'win', 'lose', 'ranking', 'unigue_id')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(all_Match)
admin.site.register(Friends)
admin.site.register(FriendRequest)