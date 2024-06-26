
from .models import Friends ,CustomUser, requsets
from django.http import JsonResponse
import json
from .login import login_required

from . serializers import TaskSerializer

def send_friend_request(request):
    if request.method == 'POST':
        sender = login_required(request)
        if not sender:
            return JsonResponse({"message": "User not found"})
        receivernaem = json.loads(request.body)['receiver']
        receiver = CustomUser.objects.get(username=receivernaem)
        re = requsets.objects.create(sender=sender, receiver=receiver)
        re.photo_profile = sender.photo_profile
        re.save()
        return JsonResponse({"message": "Friend request sent"})
    
def suggest_friend(request):
    # all_users = CustomUser.objects.all().exclude(
    #     unigue_id=0).exclude(id=request.session.get('user_id'))
    all_users = CustomUser.objects.all().exclude(id=request.session.get('user_id'))
    data = TaskSerializer(all_users, many=True)
    return JsonResponse(data.data, safe=False)

        
def get_friend_requests(request):
    user = login_required(request)
    if not user:
        return JsonResponse({"message": "User not found"})
    requests = requsets.objects.filter(receiver=user)
    data = []
    for req in requests:
        request_data = {
            'sender_username': req.sender.username,
            'photo_profile': req.photo_profile.url if req.photo_profile else None 
        }
        data.append(request_data)
    return JsonResponse(data, safe=False)

def accept_friend_request(request):
    if request.method == 'POST':
        sender = CustomUser.objects.get(username=request.POST['sender'])
        receiver = request.user
        requsets.objects.filter(sender=sender, receiver=receiver).delete()
        Friends.objects.create(user1=sender, user2=receiver)
        Friends.objects.create(user1=receiver, user2=sender)
        return JsonResponse("Friend request accepted")

def get_friends(request):
    user = login_required(request)
    if not user:
        return JsonResponse({"message": "User not found"})
    friends = Friends.objects.filter(user1=user)
    data = []
    for friend in friends:
        data.append(friend.user2.username)
    return JsonResponse(data, safe=False)

def reject_friend_request(request):
    if request.method == 'POST':
        sender = CustomUser.objects.get(username=request.POST['sender'])
        receiver = request.user
        requsets.objects.filter(sender=sender, receiver=receiver).delete()
        return JsonResponse("Friend request rejected")


        