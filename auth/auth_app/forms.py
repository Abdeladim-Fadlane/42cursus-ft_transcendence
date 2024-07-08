from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class CustomUserForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already in use. Please use a different email address.")
        return email
    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        try:
            validate_password(password1, self.instance)
        except forms.ValidationError as error:
            self.add_error('password1', error)
        return password1
