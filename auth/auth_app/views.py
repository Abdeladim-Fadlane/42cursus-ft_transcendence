from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token  # type: ignore
from django.shortcuts import redirect
from django.http import HttpResponseBadRequest
from urllib.parse import urlencode
from rest_framework import generics, permissions  # type: ignore
from .serializers import TaskSerializer, MatchSerializer
import requests
import secrets
import os
from django.conf import settings

from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from .forms import CustomUserForm
from .models import *
from .forms import CustomUserForm
from .models import CustomUser, all_Match
from rest_framework.authtoken.models import Token  # type: ignore
from django.http import JsonResponse

state = secrets.token_urlsafe(16)
client_id = os.environ.get('client_id')
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
        return JsonResponse({'status': True}, status=200)
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            request.session['user_id'] = user.id
            request.session['token'] = token.key
            user.available = True
            login(request, user)
            user.save()
            return JsonResponse({'status': True}, status=200)
        else:
            return JsonResponse({'status': False}, status=200)
    return JsonResponse({'status': True}, status=200)


def SignUp(request):
    if request.method == "POST":
        user_form = CustomUserForm(request.POST)
        if user_form.is_valid():
            user_form.save()
            return JsonResponse({'status': True}, status=200)
        else:
            return JsonResponse({"status": False, "error": user_form.errors}, status=200)
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
    response = requests.post(token_url, data=data)
    if response.status_code == 200:
        return response.json()['access_token']
    return None


def store_data_in_database(request, access_token):
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
            if created:
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
                    user.available = True
                    user.save()
                user.save()
            token, _, = Token.objects.get_or_create(user=user)
            request.session['user_id'] = user.id
            request.session['token'] = token.key
            user.save()
        else:
            token, _, = Token.objects.get_or_create(user=fuser)
            request.session['user_id'] = fuser.id
            request.session['token'] = token.key
            fuser.available = True
            fuser.save()


def callback(request):
    code = request.GET.get('code')
    state_req = request.GET.get('state')
    if state_req != state:
        return HttpResponseBadRequest("invalid state parameter", status=400)
    access_token = exchange_code_for_token(code)
    if access_token:
        store_data_in_database(request, access_token)
        return redirect('/home/')
    else:
        return HttpResponseBadRequest("Failed to authenticate", status=400)


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
