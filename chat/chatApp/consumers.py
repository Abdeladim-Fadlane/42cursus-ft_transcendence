import json 
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
class ChatLive(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
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
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
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
            """ this is the way to send message to the friend """
            time = str(message_obj.time_added)
            room_name = "room_1"
            await self.channel_layer.group_send(
               room_name,
               {
                    "type": "chat_message",
                    "message": "friend send message",

               }
            )

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
    async def chat_message(self, event):
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
