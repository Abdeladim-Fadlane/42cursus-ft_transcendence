from django.urls import path
from . import views

urlpatterns = [
    path('room/', views.ft),
    path('tournament/', views.tournament),
    path('four_players/', views.four_players),
]