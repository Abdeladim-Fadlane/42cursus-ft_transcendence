
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token # type: ignore
from django.shortcuts import redirect 
from django.http import HttpResponseBadRequest
from urllib.parse import urlencode
from rest_framework import generics, permissions # type: ignore
from .serializers import TaskSerializer ,MatchSerializer
import requests 
import secrets
import os
from django.conf import settings

from django.shortcuts import redirect
from django.contrib.auth import authenticate ,login
from .forms import CustomUserForm 
from .models import *
from .forms import CustomUserForm
from .models import CustomUser ,all_Match
from rest_framework.authtoken.models import Token # type: ignore
from django.http import JsonResponse

state = secrets.token_urlsafe(16)
client_id =  os.environ.get('client_id')
redirect_uri = os.environ.get('redirect_uri')
client_secret = os.environ.get('client_secret')

def login_required(request):
    if request.user.is_authenticated:
        return request.user
    if 'token' in request.session and 'user_id' in request.session:
        try:
            user = CustomUser.objects.get(id=request.session['user_id'])
        except CustomUser.DoesNotExist:
            return None
        return user
    return None
   

def SignIn(request):
    if request.user.is_authenticated:
        return JsonResponse({'status':True}, status=200)
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user :
            token ,_ = Token.objects.get_or_create(user=user)
            request.session['user_id'] = user.id
            request.session['token'] = token.key
            login(request, user)
            user.is_online = True
            user.save()
            return JsonResponse({'status':True}, status=200)
        else:
            return JsonResponse({'status':False}, status=200)
    return JsonResponse({'status':True}, status=200)

def SignUp(request):
    if request.method == "POST":
        user_form = CustomUserForm(request.POST)
        if user_form.is_valid():
            user_form.save()
            return JsonResponse({'status': True}, status=200)
        else:
            return JsonResponse({"status": False,"error": user_form.errors}, status=200)
    return JsonResponse({'status': False}, status=200)


def redirect_to_42(request):
    data = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'public',
        'state': state
    }
    authorize_url = f"https://api.intra.42.fr/oauth/authorize?{urlencode(data)}"
    return redirect(authorize_url)


def exchange_code_for_token(code):
    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_uri
    }
    response = requests.post(token_url,data=data)
    response_data = response.json()
    if 'access_token' in response_data :
        return response_data['access_token']
    else:
        return None
    
def store_data_in_database(request,access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        login = user_data['login']
        try:
            fuser = CustomUser.objects.get(unigue_id=user_data['id'])
        except CustomUser.DoesNotExist:
            fuser = None
        if fuser is None:
            try:
                user = CustomUser.objects.get(username=login)
            except CustomUser.DoesNotExist:
                user = None
            if user:
                if user.unigue_id != user_data['id']:
                    login = login + str(user_data['id'])
            user, created = CustomUser.objects.get_or_create(username=login, email=user_data['email'])
            if  created:
                user.first_name = user_data['displayname'].split(' ')[0]
                user.last_name = user_data['displayname'].split(' ')[1]
                user.unigue_id = user_data['id']
                profile_picture_url = user_data['image']['link']
                response = requests.get(profile_picture_url)
                if response.status_code == 200:
                    filename = os.path.basename(profile_picture_url)
                    save_path = os.path.join(settings.MEDIA_ROOT, 'User_profile', filename)
                    with open(save_path, 'wb') as f:
                        f.write(response.content)
                    user.photo_profile = f'User_profile/{filename}'
                    user.save()
                user.save()
                # login(request, user)
            token,_,= Token.objects.get_or_create(user=user)
            request.session['user_id'] = user.id
            request.session['token'] = token.key
            user.is_online = True
            user.save()
        else:
            token,_,= Token.objects.get_or_create(user=fuser)
            request.session['user_id'] = fuser.id
            request.session['token'] = token.key
            fuser.is_online = True
            fuser.save()


def callback(request):
    code = request.GET.get('code')
    state_req = request.GET.get('state')
    if state_req != state :
        return HttpResponseBadRequest("invalid state parameter")
    access_token = exchange_code_for_token(code)
    if access_token :
        store_data_in_database(request,access_token)
        return redirect('/home/')    
    else:
        return HttpResponseBadRequest("Failed to authenticate")
    

class TaskListCreateAPIView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)


class TaskRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)

class MatchListCreateAPIView(generics.ListCreateAPIView):
    queryset = all_Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)
    



from .models import Friends ,CustomUser, FriendRequest
from django.http import JsonResponse
import json
from .views import  login_required
from django.http import HttpResponseBadRequest
from . serializers import TaskSerializer

def send_friend_request(request):
    sender = login_required(request)
    if not sender:
        return HttpResponseBadRequest("Forbidden", status=403)
    if request.method == 'POST':
        receivernaem = json.loads(request.body)['receiver']
        receiver = CustomUser.objects.get(username=receivernaem)
        re = FriendRequest.objects.create(sender=sender, receiver=receiver)
        re.photo_profile = sender.photo_profile
        re.save()
        return JsonResponse({"status":True})
    return JsonResponse({"status":False})
    
def suggest_friend(request):
    user_login = login_required(request)
    if not user_login:
        return HttpResponseBadRequest("Forbidden", status=403)
    
    all_users = CustomUser.objects.all().exclude(id=request.session.get('user_id'))
    all_users = all_users.exclude(username='root')

    resive = FriendRequest.objects.filter(receiver=request.session.get('user_id'))
    for req in resive:
        all_users = all_users.exclude(username=req.sender.username)
    

    sendreqest = FriendRequest.objects.filter()
    for req in sendreqest:
        all_users = all_users.exclude(username=req.receiver.username)


    friends = Friends.objects.filter(user1=request.session.get('user_id'))
    for friend in friends:
        all_users = all_users.exclude(username=friend.user2.username)

    data = TaskSerializer(all_users, many=True)
    return JsonResponse(data.data, safe=False)

        
def get_friend_requests(request):
    user = login_required(request)
    if not user:
        return HttpResponseBadRequest("Forbidden", status=403)
    requests = FriendRequest.objects.filter(receiver=user)
    data = []
    for req in requests:
        request_data = {
            'sender_username': req.sender.username,
            'photo_profile': req.photo_profile.url if req.photo_profile else None 
        }
        data.append(request_data)
    return JsonResponse(data, safe=False)

def reject_friend_request(request, sender_username):
    receiver = login_required(request)
    if not receiver:
        return HttpResponseBadRequest("Forbidden", status=403)
    sender = CustomUser.objects.get(username=sender_username)
    friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver)
    if friend_request:
        friend_request.delete()
        return JsonResponse({'status': True})
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
        return HttpResponseBadRequest("Forbidden", status=403)
    if sender_username is None:
        return JsonResponse({'error': 'Sender username not provided'}, status=400)

    if actoin == 'reject':
        return reject_friend_request(request, sender_username)
    else:
        sender = CustomUser.objects.get(username=sender_username)
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
        return HttpResponseBadRequest("Forbidden", status=403)
    friends = Friends.objects.filter(user1=user)
    data = []
    for friend in friends:
        friend_data = {
            'username': friend.user2.username,
            'photo_profile': friend.user2.photo_profile.url if friend.user2.photo_profile else None 
        }
        data.append(friend_data)
    return JsonResponse(data, safe=False)



def delete_friend(request):
    user = login_required(request)
    if not user:
        return HttpResponseBadRequest("Forbidden", status=403)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    data = json.loads(request.body)
    friend_username = data.get('receiver', None)
    if friend_username is None:
        return JsonResponse({'error': 'Friend username not provided'}, status=400)
    friend = CustomUser.objects.get(username=friend_username)
    Friends.objects.filter(user1=user, user2=friend).delete()
    Friends.objects.filter(user1=friend, user2=user).delete()
    return JsonResponse({'status': True})

def online_friends(request):
    user = login_required(request)
    if not user:
        return HttpResponseBadRequest("Forbidden", status=403)
    friends = Friends.objects.filter(user1=user)
    data = []
    for friend in friends:
        if friend.user2.is_online:
            friend_data = {
                'username': friend.user2.username,
                'photo_profile': friend.user2.photo_profile.url if friend.user2.photo_profile else None 
            }
            data.append(friend_data)
    return JsonResponse(data, safe=False)



def frined_profile(request):
    user = login_required(request)
    if not user:
        return  HttpResponseBadRequest("Forbidden", status=403)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    username = json.loads(request.body)['username']
    friend = CustomUser.objects.get(username=username)
    data = TaskSerializer(friend)
    return JsonResponse(data.data, safe=False)