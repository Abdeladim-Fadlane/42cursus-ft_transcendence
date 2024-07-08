"""
ASGI config for track project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
from channels.auth import AuthMiddlewareStack # type: ignore

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game_project.settings')
from django.urls import path

from track_app.consumers import TrackConsumer

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter([
            path('wss/track/', TrackConsumer.as_asgi()),
        ])
    ),
  
})
