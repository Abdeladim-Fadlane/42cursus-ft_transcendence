from django.urls import path
from . import consumers
websocket_urlpatterns = [
    path('chat/<str:room_name>/', consumers.ChatLive.as_asgi()),
]