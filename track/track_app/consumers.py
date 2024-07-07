from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import asyncio

class TrackConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print(f"user connected: {self.scope['user']}")

    async def disconnect(self, close_code):
        print(f"user disconnected with code: {close_code}")

    async def receive(self, text_data=None, bytes_data=None):
        # Handle incoming WebSocket messages
        print(f"received message: {text_data}")
        await self.send(text_data="message received")

