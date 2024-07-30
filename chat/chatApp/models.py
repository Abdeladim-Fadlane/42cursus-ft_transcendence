from django.db import models

# Create your models here.

class Conversation(models.Model):
    room_name = models.TextField(default="")
    created_at = models.DateTimeField(auto_now=True)
    block_conversation = models.BooleanField(default=False)
    user_bloking = models.TextField(default="")
    # user1_views = models.IntegerField()
    # number_message = models.IntegerField(default=0)
    def __str__(self):
        return self.room_name

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(max_length=200,null=True, blank=True,default="")
    sender_name = models.TextField(max_length=200,null=True, blank=True,default="")
    time_added = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['time_added']
    def __str__(self):
        return "messageFrom_" + self.sender_name
