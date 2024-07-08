from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import requests
def patch_data(scope,status):
    query_string = scope['query_string'].decode().split('&')
    token = query_string[0].split('=')[1]
    user_id = query_string[1].split('=')[1]
    headers = {
        "Authorization": f"Token {token}",
    }
    body = {
        "available": status
    }
    url = url = f'http://auth:8000/api/tasks/{user_id}/'
    requests.patch(url, headers=headers, data=(body))

class TrackConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        patch_data(self.scope,True)

    async def disconnect(self, close_code):
        patch_data(self.scope,False)


