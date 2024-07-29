
from django.urls import path
from . import views

urlpatterns = [
    path('notify/', views.notify),
]