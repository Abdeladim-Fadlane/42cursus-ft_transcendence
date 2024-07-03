
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    photo_profile = models.ImageField(upload_to='User_profile', default="User_profile/default_profile.png")
    display_name = models.CharField(max_length=10, default="Untitled")
    score = models.IntegerField(default=10)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    win = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)
    ranking = models.IntegerField(default=0)
    total_match = models.IntegerField(default=0)
    unigue_id = models.IntegerField(default=0)
    def __str__(self):
        return self.username
    

class all_Match(models.Model):
    winner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='winner')
    loser = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='loser')
    date = models.DateTimeField(auto_now_add=True)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    def __str__(self):
        return self.winner.username + " vs " + self.loser.username +  " " + str(self.score1) + " - " + str(self.score2)

class Friends(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user2')
    def __str__(self):
        return self.user1.username + " and " + self.user2.username

class FriendRequest(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='receiver')
    photo_profile =  photo_profile = models.ImageField(upload_to='User_profile', default="User_profile/default_profile.png")
    def __str__(self):
        return self.sender.username + " and " + self.receiver.username