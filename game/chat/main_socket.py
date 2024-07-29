import asyncio, json
from . views import endpoint
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
# from asgiref.sync import sync_to_async
from . cons import User, Match
import requests
import os
from . cons import add_padding
from cryptography.fernet import Fernet
connects = {}    

class main_socket(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.avaible = True
        query_string = self.scope['query_string'].decode().split('&')
        token = query_string[0].split('=')[1]
        key = os.environ.get('encrypt_key')
        f = Fernet(key)
        token = f.decrypt(add_padding(token).encode()).decode()
        id = query_string[1].split('=')[1]
        data = endpoint(token, id)
        self.user = User(data)
        connects[self.user.username] = self


    async def receive(self, text_data):
        global room_name
        data = json.loads(text_data)
        if data.get('type') == 'room.create':
            await connects[data.get('vs')].send(json.dumps({'type':'game.challenge', 'vs': self.user.serialize_User()}))
            self.room_name = 'room_' + datetime.now().time().strftime("%H_%M_%S_%f")
        elif data.get('type') == 'room.refuse':
            await connects[data.get('vs')].send(json.dumps({'type':'game.refuse', 'vs': self.user.serialize_User()}))

    async def send_data(self, event):
        if self.avaible:
            await self.send(event['data'])

    async def disconnect(self, event):
        del connects[self.user.username]