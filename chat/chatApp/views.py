from django.shortcuts import render
from .models import Conversation, Message
from django.http import JsonResponse 
from .Serializer import *
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import json

# Create your views here.



def getAllConversationMessage(request):
    if (request.method == 'POST'):
        json_content = json.loads(request.body)
        user_id = str(json_content.get('id_user'))
        tab = []
        convers = Conversation.objects.all()
        
        if (convers is not None):
            for c in convers:
                if (user_id in c.room_name):
                    count = 0
                    user_sender = ''
                    msgs = Message.objects.filter(conversation=c, read_msg=False)
                    for msg in msgs:
                        if (int(json_content.get('id_user')) != int(msg.sender_name)):
                            count = count + 1
                            user_sender = msg.sender_name
                    if (user_sender != '' and count != 0):
                        tab.append({'sender_name' : user_sender, 'count_message' : count})
            return JsonResponse({'status' : 'success','values' : tab})
        return JsonResponse({'status' : 'success', 'values' : ''})
    return JsonResponse({'status' : 'error'})


def getAllConversation(request):
    if (request.method == 'POST'):
        json_content = json.loads(request.body)
        user_id = str(json_content.get('id_user'))
        count = 0
        # print('=======================> ', user_id)  
        try:
            convers = Conversation.objects.all()
            for c in convers:
                if (user_id in c.room_name):
                    msg = Message.objects.filter(conversation=c).last()
                    if (msg is not None and msg.read_msg == False and int(json_content.get('id_user')) != int(msg.sender_name)):
                        # print('is here enetring ')             
                        count = count + 1
            # print('=============>' ,  count)   
            return JsonResponse({'status' : 'success','not_read' : count})
        except Exception as e:
            return JsonResponse({'status' : 'success', 'not_read' : 0})
    return JsonResponse({'status' : 'error'})


def Message_readed(request):
    if (request.method == 'POST'):
        try:
            json_data = json.loads(request.body) 
            conver = Conversation.objects.get(room_name=json_data.get('room_name'))
            messages = Message.objects.filter(conversation=conver).exclude(sender_name=json_data.get('username'))
            for msg in messages:
                if (msg.read_msg == False): 
                    msg.read_msg = True
                    msg.save()
            return JsonResponse({'status' : 'success'})
        except Exception as e:
            return JsonResponse({'status' : 'success'})
    return JsonResponse({'status' : 'error'})
    
        
def delete_conversation(request, username):
    conves = Conversation.objects.all()
    for obj in conves:
        if (username in obj.room_name):
            obj.delete() 
    return JsonResponse({'status' : 'success'})


def MessageHistory(request, room_name):
    try:
        _conversation = Conversation.objects.get(room_name=room_name)
        message = Message.objects.filter(conversation=_conversation)
        json_message = MessageSerializer(
            message, 
            many=True
        )
        return JsonResponse(json_message.data, safe=False)
    except Exception as e:
        return JsonResponse({}, safe=False)
        

        

def retrun_conversation(request, room_name):
    if request.method == "GET":
        _conversation = Conversation.objects.get(room_name=room_name)
        json_message = ConversationSerializer(_conversation, many=False)
        return JsonResponse(json_message.data, safe=False)
    return JsonResponse({'status' : 'error'})
    

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
                _conversation.user_bloking = -1
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
