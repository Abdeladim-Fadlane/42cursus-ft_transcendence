from .models import Friends, CustomUser, FriendRequest
from django.http import JsonResponse
import json
from .views import login_required ,notify
from .login import logout as log
from django.http import HttpResponseForbidden
from .serializers import TaskSerializer
from django.contrib.auth import logout

def reponceNotify(request):
    if request.method == 'GET':
        id = request.GET.get('id')
        all_id = list(CustomUser.objects.all().values_list('id', flat=True).exclude(id=id))
        friends = []
        for i in all_id:
            if Friends.objects.filter(user1=id, user2=i):
                friends.append(i)
        return JsonResponse({'usersid': friends}, status=200)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def send_friend_request(request):
    sender = login_required(request)
    if not sender:
        return HttpResponseForbidden("Forbidden", status=403)
    if request.method == 'POST':
        receivership = json.loads(request.body)['receiver']
        receiver = CustomUser.objects.get(username=receivership)
        if FriendRequest.objects.filter(sender=sender, receiver=receiver):
            return JsonResponse({"status": False}, status=405)
        if FriendRequest.objects.filter(sender=receiver, receiver=sender):
            return JsonResponse({"status": False}, status=405)
        FriendRequest.objects.create(sender=sender, receiver=receiver)
        notify(receiver.id, 'friend_request_send')
        return JsonResponse({"status": True}, status=200)

    return JsonResponse({"status": False}, status=405)


def suggest_friend(request):
    user_login = login_required(request)
    if not user_login:
        return HttpResponseForbidden("Forbidden", status=403)
    """ get all users except the user who is login """
    all_users = CustomUser.objects.all().exclude(id=request.session.get('user_id'))
    all_users = all_users.exclude(username='root')

    """ get all users except the user who is login and the user who send friend request to him """
    resive = FriendRequest.objects.filter(receiver=request.session.get('user_id'))
    for req in resive:
        all_users = all_users.exclude(username=req.sender.username)

    """ get all users except the user who is login and the user who he send friend request to him """
    sendreqest = FriendRequest.objects.filter(sender=request.session.get('user_id'))
    for req in sendreqest:
        all_users = all_users.exclude(username=req.receiver.username)

    friends = Friends.objects.filter(user1=request.session.get('user_id'))
    for friend in friends:
        all_users = all_users.exclude(username=friend.user2.username)

    data = TaskSerializer(all_users, many=True)    
    return JsonResponse(data.data, safe=False, status=200)


def get_friend_requests(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    requests = FriendRequest.objects.filter(receiver=user)
    data = []
    for req in requests:
        request_data = {
            'sender_username': req.sender.username,
            'photo_profile': req.sender.photo_profile.url
        }
        data.append(request_data)
    """ here should send channel request to the user to notify him that he has friend request """

    return JsonResponse(data, safe=False, status=200)


def reject_friend_request(request, sender_username):
    receiver = login_required(request)
    if not receiver:
        return HttpResponseForbidden("Forbidden", status=403)
    sender = CustomUser.objects.get(username=sender_username)
    friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver)
    if friend_request:
        friend_request.delete()
        return JsonResponse({'status': True}, status=200)
    else:
        return JsonResponse({'error': 'Friend request not found'}, status=404)


def accept_friend_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    data = json.loads(request.body)
    sender_username = data.get('sender', None)
    actoin = data.get('action', None)
    receiver = login_required(request)
    if not receiver:
        return HttpResponseForbidden("Forbidden", status=403)
    if sender_username is None:
        return JsonResponse({'error': 'Sender username not provided'}, status=400)

    if actoin == 'reject':
        notify(CustomUser.objects.get(username=sender_username).id, 'friend_request_reject')
        return reject_friend_request(request, sender_username)
    else:
        sender = CustomUser.objects.get(username=sender_username)
        friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver)
        if friend_request:
            friend_request.delete()
            Friends.objects.create(user1=sender, user2=receiver)
            Friends.objects.create(user1=receiver, user2=sender)
            context = {'status': True}
            notify(sender.id, 'friend_request_accept')
            return JsonResponse(data=context, status=200)
        else:
            return JsonResponse({'error': 'Friend request not found'}, status=404)

def get_friends(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    friends = Friends.objects.filter(user1=user)
    data = []
    for friend in friends:
        friend_data = {
            'user_id' : friend.user2.id,
            'username': friend.user2.username,
            'photo_profile': friend.user2.photo_profile.url
        }
        data.append(friend_data)
    return JsonResponse(data, safe=False, status=200)


def delete_friend(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    data = json.loads(request.body)
    friend_username = data.get('receiver', None)
    if friend_username is None:
        return JsonResponse({'error': 'Friend username not provided'}, status=400)
    try:
        friend = CustomUser.objects.get(username=friend_username)
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'Friend not found'}, status=404)
    Friends.objects.filter(user1=user, user2=friend).delete()
    Friends.objects.filter(user1=friend, user2=user).delete()
    notify(friend.id, 'friend_delete')
    return JsonResponse({'status': True}, status=200)


def online_friends(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    friends = Friends.objects.filter(user1=user)
    data = []
    for friend in friends:
        if friend.user2.available:
            friend_data = {
                'username': friend.user2.username,
                'photo_profile': friend.user2.photo_profile.url
            }
            data.append(friend_data)
    friends = Friends.objects.filter(user2=user)
    for friend in friends:
        if friend.user1.available:
            friend_data = {
                'username': friend.user1.username,
                'photo_profile': friend.user1.photo_profile.url
            }
            if friend_data not in data:
                data.append(friend_data)
    return JsonResponse(data, safe=False, status=200)


def frined_profile(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    username = json.loads(request.body)['username']
    try:
        friend = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    data = TaskSerializer(friend)
    return JsonResponse(data.data, safe=False, status=200)


def delete_account(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    if hasattr(user, 'photo_profile'):
        if user.photo_profile != "User_profile/avatar.svg":
            user.photo_profile.delete(save=False)
    logout(request)
    user.delete()
    return JsonResponse({'status': True}, status=200)


def getAllUser(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    users = CustomUser.objects.all()
    data = TaskSerializer(users, many=True)
    return JsonResponse(data.data, safe=False)


def getAllUserTrack(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    all_id = list(CustomUser.objects.all().values_list('id', flat=True))
    return JsonResponse({'usersid': all_id}, status=200)