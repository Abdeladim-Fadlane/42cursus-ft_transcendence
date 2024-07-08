from .models import Message, Conversation
from rest_framework import serializers

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            'room_name',
            'block_conversation',
            'user_bloking',
                ]

class MessageSerializer(serializers.ModelSerializer):
    conversation = ConversationSerializer()
    class Meta:
        model = Message
        fields = [
            'conversation',
            'content',
            'sender_name',
            'time_added',
        ]
