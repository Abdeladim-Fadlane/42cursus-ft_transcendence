from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User
from .models import CustomUser
from .models import *


class CustomUserForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = [
            'username', 
            'first_name',
            'last_name',
            'email',
            'password1', 
            'password2',
            ]