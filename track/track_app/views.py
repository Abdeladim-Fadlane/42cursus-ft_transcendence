from django.shortcuts import render
from channels.layers import get_channel_layer # type: ignore
from asgiref.sync import async_to_sync
import requests
from django.http import JsonResponse

async def notification(id, action):
    channel_layer = get_channel_layer()
    
    room_name = f"room_{id}"
    try:
        await channel_layer.group_send(
            room_name,
            {
                "type": "chat_message",
                "message": action
            }
        )
    except Exception as e:
        pass

async def notify(request):
    if request.method == 'GET':
        id = request.GET.get('id')
        action = request.GET.get('action')
        channel_layer = get_channel_layer()
        room_name = f"room_{id}"
        try:
            await channel_layer.group_send(
                room_name,
                {
                    "type": "chat_message",
                    "message": action
                }
            )
        except Exception as e:
            return JsonResponse({'status': 'internal server error'}, status=500)
        return JsonResponse({'status': 'success'}, status=200)
    return JsonResponse({'status': 'Method not allowed'}, status=405)
