from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User
from django.db import models as modelsField
from .models import *



class UserForm(UserCreationForm):
    class Meta:
        model = User
        fields = [
            'username', 
            'first_name',
            'last_name',
            'email',
            'password1', 
            'password2',
            ]

class Userchange(UserChangeForm):
    class Meta:
        model = User
        fields = [
            'username', 
            'first_name',
            'last_name',
            'email', 
            'password', 
        ]