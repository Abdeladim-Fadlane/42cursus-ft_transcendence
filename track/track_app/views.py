from django.shortcuts import render
# from channels.layers import get_channel_layer # type: ignore
# from asgiref.sync import async_to_sync
# import requests
# from django.http import JsonResponse

# async def notification(id, action):
#     channel_layer = get_channel_layer()
#     room_name = f"room_{id}"
#     try:
#         await channel_layer.group_send(
#             room_name,
#             {
#                 "type": "chat_message",
#                 "message": action
#             }
#         )
#     except Exception as e:
#         print(f"Failed to send message: {e}")

