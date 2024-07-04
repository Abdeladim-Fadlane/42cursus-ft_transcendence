from django.urls import path
from . import Tournament
from . import four_players
from . import cons

websocket_urlpatterns = [
    path('wss/game/', cons.RacetCunsumer.as_asgi()),
    path('wss/tournament/', Tournament.Tournament.as_asgi()),
    path('wss/four_players/', four_players.four_players.as_asgi()),
]