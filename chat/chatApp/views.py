from django.shortcuts import render
from .models import Conversation, Message
from django.http import JsonResponse 
from .Serializer import *
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import json

# Create your views here.

def change_room_name(request, oldusername, newusername):
    conves = Conversation.objects.all()
    for obj in conves:
        if (oldusername in obj.room_name):
            obj.room_name = obj.room_name.replace(oldusername, newusername)
            obj.save()
    msgs = Message.objects.filter(sender_name=oldusername)
    for msg in msgs:
        msg.sender_name = newusername
        msg.save()
    return JsonResponse({'status' : 'success'})
            

def delete_conversation(request, username):
    conves = Conversation.objects.all()
    for obj in conves:
        if (username in obj.room_name):
            obj.delete()
    return JsonResponse({'status' : 'success'})


def MessageHistory(request, room_name):
    _conversation = Conversation.objects.get(room_name=room_name)
    message = Message.objects.filter(conversation=_conversation)
    json_message = MessageSerializer(
        message, 
        many=True
    )
    return JsonResponse(json_message.data, safe=False)
        

def retrun_conversation(request, room_name):
    _conversation = Conversation.objects.get(room_name=room_name)
    json_message = ConversationSerializer(_conversation, many=False)
    return JsonResponse(json_message.data, safe=False)

@csrf_exempt
def csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def block_user(request):
    if (request.method == "POST"):
        json_data = json.loads(request.body)
        username = json_data.get('username')
        room_name = json_data.get('room_name')
        action = json_data.get('action')
        if (action == 'block'):
            try:
                _conversation = Conversation.objects.get(room_name=room_name)
                _conversation.block_conversation = True
                _conversation.user_bloking = username
                _conversation.save()
                return JsonResponse({
                    'status' : 'success',
                    'message' : 'the user ' +  action +  ' with success',
                    'action' : 'block',
                    })
            except Conversation.DoesNotExist:
                return JsonResponse({
                    'status' : 'error',
                    'message' : 'failer to ' +  action +  ' user',
                    'action' : 'block'
                    })
        elif (action == "unblock"): 
            try:
                _conversation = Conversation.objects.get(room_name=room_name)
                _conversation.block_conversation = False
                _conversation.user_bloking = ""
                _conversation.save()
                return JsonResponse({
                    'status' : 'success',
                    'message' : 'the user ' +  action +  ' with success',
                    'action' : 'unblock'
                    })
            except Conversation.DoesNotExist:
                return JsonResponse({
                    'status' : 'error',
                    'message' : 'failer to ' +  action +  ' user',
                    'action' : 'unblock'
                    })
    return HttpResponse('done')
