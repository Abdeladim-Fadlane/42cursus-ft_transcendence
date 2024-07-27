from django.shortcuts import render, redirect
import requests
# Create your views here.
# from auth_app.models import User

def endpoint(token, id):
    headers = {'Authorization': f'Token {token}'}
    url = f'http://auth:8000/tasks/{id}'
    response = requests.get(url, headers=headers)
    data = None
    print(response.status_code, "-----------------response.status_code------------------")
    if response.status_code == 200:
        data = response.json()
        data['photo_profile'] = data['photo_profile'].replace('http://auth:8000/', '')
    return data

def ft(request):
    contex = endpoint(request)
    return render(request, contex)

def tournament(request):
    pass
    # req = request
    # access_token = request.session.get('access_token')
    # if access_token is None:
    #     return redirect('/')
    # if access_token:
    #     try:
    #         user = User.objects.get(token_access=access_token)
    #     except User.DoesNotExist:
    #         return redirect('/')
    # return render(request, 'chat/tournament.html', {'user': user})

def four_players(request):
    pass
    # req = request
    # access_token = request.session.get('access_token')
    # if access_token is None:
    #     return redirect('/')
    # if access_token:
    #     try:
    #         user = User.objects.get(token_access=access_token)
    #     except User.DoesNotExist:
    #         return redirect('/')
    # return render(request, 'chat/four_players.html', {'user': user})