from django.shortcuts import render
from .models import Conversation, Message
from django.http import JsonResponse 
from .Serializer import *
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import json

# Create your views here.
def dalete_message(request):
    if (request.method == 'POST'):
        try:
            username = json.loads(request.body).get('username')
            msg = Message.objects.filter(sender_name=username)
            msg.conversation.delete()
            return JsonResponse({'status' : 'ok'})
        except (Message.DoesNotExist):
            return JsonResponse({'status' : 'error'})
    return JsonResponse({'status' : 'error'})

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
