from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import requests
from cryptography.fernet import Fernet
import os
import json
from channels.layers import get_channel_layer # type: ignore

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
    requests.patch(url,headers=headers, json=data)

async def notification(scope,status):
    query_string = scope['query_string'].decode().split('&')
    user_id = query_string[1].split('=')[1]
    url2 = 'http://auth:8000/notify_friend/'
    data2 = {
        'id': user_id,
    }
    res = requests.get(url=url2,params=data2)
    usersid_dic = res.json()
    ids = usersid_dic.get('usersid',[])
    channel_layer = get_channel_layer()
    for i in ids:
        room_name = f"room_{i}"
        await channel_layer.group_send(room_name,{"type": "chat_message","message": "friend is online" if status else "friend is offline"})

class TrackConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode().split('&')
        user_id = query_string[1].split('=')[1]
        self.room_name = f'room_{user_id}'
        
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()
        patch_data(self.scope,True)
        await notification(self.scope,True)

    async def receive(self, text_data):
        pass

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))


    async def disconnect(self, close_code):
        patch_data(self.scope,False)
        await notification(self.scope,False)
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )