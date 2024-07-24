from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import requests
from cryptography.fernet import Fernet
import os


def add_padding(data):
    """Ensure correct padding for base64 encoded string."""
    return data + '=' * (-len(data) % 4)

def patch_data(scope,status):
    query_string = scope['query_string'].decode().split('&')
    token = query_string[0].split('=')[1]
    user_id = query_string[1].split('=')[1]
    key = os.environ.get('encrypt_key')
    f = Fernet(key)
    token = f.decrypt(add_padding(token).encode()).decode()
    headers = {
        'Authorization': f'Token {token}'
    }
    data = {
        'available': status
    }
    url = f'http://auth:8000/api/tasks/{user_id}/'
    res = requests.patch(url,headers=headers, json=data)
    

class TrackConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        patch_data(self.scope,True)

    async def disconnect(self, close_code):
        patch_data(self.scope,False)


