import json 
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer 
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
import time
from . import views
import requests
import json

def endpoint(token, id):
    headers = {'Authorization': f'Token {token}'}
    url = f'http://auth:8000/tasks/{id}'
    response = requests.get(url, headers=headers)
    data = None
    if response.status_code == 200:
        data = response.json()
        data['photo_profile'] = data['photo_profile'].replace('http://auth:8000/', '')
    return data

class   User:
    def __init__(self, dict):
        for key, value in dict.items():
            setattr(self, key, value)

    def serialize_User(self):
        return{
            'login':self.username,
            'icon':self.photo_profile,
        }


def check_User(room_name, user_id, user_token):
    if (user_id is None or user_token is None or room_name is None):
        return False
    # print(f"{user_id} ==== {user_token}")  
    user = User(endpoint(user_token, user_id))
    if (user is None or not (str(user.id) in room_name)):
        return False
    return True
    
class ChatLive(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        token = self.scope["url_route"]["kwargs"]["token"]
        id_user = self.scope["url_route"]["kwargs"]["id"]
        await self.accept()
        if (check_User(self.room_name, id_user, token) == False):
            await self.send(json.dumps({'type':'error', 'status': 'token not valid'}))
            await self.close()
            return 
        try:
            conversation = await sync_to_async(Conversation.objects.get)(room_name=self.room_name)
        except (Conversation.DoesNotExist):
            conversation =  await sync_to_async(Conversation)(room_name=self.room_name)
            await sync_to_async(conversation.save)()
        self.room_group_name = self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if (text_data_json['task'] == 'is_typing'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'action' : text_data_json['action'],
                    'type': 'chat_message',
                    'task' : text_data_json['task'],
                    'sender' : text_data_json['sender'],
            })
            return
        message = text_data_json['message']
        sender = text_data_json['sender']
        room = text_data_json['room_name']
        task = text_data_json['task']
        time = ""
        conversation_obj = await sync_to_async(Conversation.objects.get)(room_name=self.room_name)
        if ((conversation_obj.block_conversation != True) and (task == 'send_message')):
            message_obj = await sync_to_async(Message.objects.create)(
                conversation=conversation_obj,
                sender_name=sender,
                content=message,
            )
            time = str(message_obj.time_added)
            
            
        if (conversation_obj.block_conversation == True and task == 'send_message') :
            return 
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'action' : text_data_json['action'],
                'type': 'chat_message',
                'message': message,
                'sender': sender,
                'time' : time,
                'room_name' : room,
                'block': str(conversation_obj.block_conversation),
                'user_blocking' : conversation_obj.user_bloking,
                'task' : text_data_json['task']
            }
        )
        
        if ((conversation_obj.block_conversation != True) and (task == 'send_message')):
            room_name = f"room_{text_data_json['user_id']}"
            data = {'message' : "friend send message",
                    'name' : text_data_json['name'],
                    'message_content' : message,
                }
            await self.channel_layer.group_send(
                room_name,
                {
                    "type": "chat_message",
                    "message": data,
                }
            )
           
    async def chat_message(self, event):
        if (event['task'] == 'is_typing'):
            await self.send(text_data=json.dumps({
                'status': 'success',
                'task' : event['task'],
                'action' : event['action'],
                'sender' : event['sender'],
            }))
            return 
        await self.send(text_data=json.dumps({
            'status' : 'success',
            'message': event['message'],
            'sender' : event['sender'],
            'room_name' : event['room_name'],
            'time' : event['time'],
            'block' : event['block'],
            'user_blocking' : event['user_blocking'],
            'task' : event['task'],
            'action' : event['action'],
        }))
