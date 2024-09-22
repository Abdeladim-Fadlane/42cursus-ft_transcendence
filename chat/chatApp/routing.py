from django.urls import path
from . import consumers
websocket_urlpatterns = [
    path('wss/chat/<str:room_name>/<str:token>/<str:id>', consumers.ChatLive.as_asgi()),
]