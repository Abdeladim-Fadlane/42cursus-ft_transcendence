
from .models import Friends ,CustomUser, FriendRequest
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
        re = FriendRequest.objects.create(sender=sender, receiver=receiver)
        re.photo_profile = sender.photo_profile
        re.save()
        return JsonResponse({"message": "Friend request sent"})
    
def suggest_friend(request):
    all_users = CustomUser.objects.all().exclude(id=request.session.get('user_id'))
    all_users = all_users.exclude(username='root')

    sendreqest = FriendRequest.objects.filter(sender=request.session.get('user_id'))
    resive = FriendRequest.objects.filter(receiver=request.session.get('user_id'))
    for req in resive:
        all_users = all_users.exclude(username=req.sender.username)
    for req in sendreqest:
        all_users = all_users.exclude(username=req.receiver.username)
    """ ckeck if the user is already friend with the user  """

    friends = Friends.objects.filter(user1=request.session.get('user_id'))
    for friend in friends:
        all_users = all_users.exclude(username=friend.user2.username)
    data = TaskSerializer(all_users, many=True)
    return JsonResponse(data.data, safe=False)

        
def get_friend_requests(request):
    user = login_required(request)
    if not user:
        return JsonResponse({"message": "User not found"})
    requests = FriendRequest.objects.filter(receiver=user)
    
    data = []
    for req in requests:
        request_data = {
            'sender_username': req.sender.username,
            'photo_profile': req.photo_profile.url if req.photo_profile else None 
        }
        data.append(request_data)
    return JsonResponse(data, safe=False)


def accept_friend_request(request):

    data = json.loads(request.body)
    sender_username = data.get('sender', None)
    if sender_username is None:
        return JsonResponse({'error': 'Sender username not provided'}, status=400)

    sender = CustomUser.objects.get(username=sender_username)
    receiver = login_required(request)
    
    friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver)
    if friend_request:
        friend_request.delete()
        Friends.objects.create(user1=sender, user2=receiver)
        Friends.objects.create(user1=receiver, user2=sender)
        context = {'status': True}
        return JsonResponse(data=context)
    else:
        return JsonResponse({'error': 'Friend request not found'}, status=404)



def get_friends(request):
    user = login_required(request)
    if not user:
        return JsonResponse({"message": "User not found"})
    friends = Friends.objects.filter(user1=user)
    data = []
    for friend in friends:
        friend_data = {
            'username': friend.user2.username,
            'photo_profile': friend.user2.photo_profile.url if friend.user2.photo_profile else None 
        }
        data.append(friend_data)
    return JsonResponse(data, safe=False)

def reject_friend_request(request):
    if request.method == 'POST':
        sender = CustomUser.objects.get(username=request.POST['sender'])
        receiver = request.user
        FriendRequest.objects.filter(sender=sender, receiver=receiver).delete()
        return JsonResponse("Friend request rejected")


        