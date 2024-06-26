from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=1, blank=True)
    photo_profile = models.ImageField(upload_to='User_profile/%y/%m/%d', default="User_profile/default_photo/default_profile.png")
    def __str__(self):
        return self.user.username
    
class UserFriend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=False, related_name="user_creator")
    friend = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.user.username + "_friend"
    
class Request_friend(models.Model):
    request_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_request")
    user_suggestion = models.ForeignKey(User, on_delete=models.CASCADE)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['request_user', 'user_suggestion'], name='unique_friend_request')
        ]
    def __str__(self):
        return "from_" + self.request_user.username + "_to_" + self.user_suggestion.username + "_Request"
class Match(models.Model):
    player1 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="player1")
    player2 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="player2")
    date_match = models.DateTimeField()
    details = models.TextField()
    def __str__(self):
        return self.player1.user.username + "_vs_" + self.player2.user.username