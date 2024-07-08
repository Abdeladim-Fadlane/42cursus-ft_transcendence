from rest_framework import serializers # type: ignore 

from .models import CustomUser ,all_Match


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'photo_profile', 'score','available', 'win', 'lose', 'ranking', 'first_name','last_name']
        
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = all_Match
        fields = ['winner', 'loser', 'date','score1','score2']