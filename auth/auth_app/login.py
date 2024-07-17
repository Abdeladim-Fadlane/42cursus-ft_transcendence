from django.contrib.auth import logout as log
from .models import CustomUser ,all_Match
from django.shortcuts import  redirect
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import update_session_auth_hash
from . serializers import TaskSerializer 
from django.http import HttpResponseForbidden
from .views import login_required


def get_match_history(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    if request.method == 'GET':
        try:
            user = CustomUser.objects.get(id=request.session.get('user_id'))
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': False, 'message': 'User not found'}, status=404)
        match_history = all_Match.objects.filter(winner=user)
        match_history2 = all_Match.objects.filter(loser=user)
        data = []
        for match in match_history:
            datawinner = TaskSerializer(CustomUser.objects.get(id=match.winner.id))
            datalooser = TaskSerializer(CustomUser.objects.get(id=match.loser.id))
            data.append({'winner': datawinner.data, 'loser': datalooser.data, 'date': match.date, 'score1': match.score1, 'score2': match.score2})
        for match in match_history2:
            datawinner = TaskSerializer(CustomUser.objects.get(id=match.winner.id))
            datalooser = TaskSerializer(CustomUser.objects.get(id=match.loser.id))
            data.append({'winner': datawinner.data, 'loser': datalooser.data, 'date': match.date, 'score1': match.score1, 'score2': match.score2})
        data = sorted(data, key=lambda x: x['date'], reverse=True)
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({'status': False}, status=405)
    

def logout(request):
    log(request)
    return redirect('/')

def already_logged(request):
    user = login_required(request)
    if user:
        return JsonResponse({'status': True}, status=200)
    return JsonResponse({'status': False}, status=200)

def calculate_ranking(user):
    all_users = CustomUser.objects.all()
    all_users = sorted(all_users, key=lambda x: x.score, reverse=True)
    for i in range(len(all_users)):
        if all_users[i].id == user.id:
            return i + 1
    return 0

def leadrboard(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    all_users = CustomUser.objects.all().exclude(username='root')
    all_users = sorted(all_users, key=lambda x: x.score, reverse=True)
    data = []
    for user in all_users:
        user.ranking = calculate_ranking(user)
        user.save()
        data.append(user)
    dataseriaser = TaskSerializer(data, many=True)
    return JsonResponse(dataseriaser.data,safe=False, status=200)

def data(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    user.ranking = calculate_ranking(user)
    dataseriaser = TaskSerializer(user)
    return JsonResponse(dataseriaser.data, status=200)

def token(request):
    user = login_required(request)
    if not user:
        return HttpResponseForbidden("Forbidden", status=403)
    token = request.session.get('token')
    contex = {'token': token,'id':user.id}
    return JsonResponse(contex, status=200)


def update_profile(request):
    if request.method == 'POST':
        user = login_required(request)
        if not user:
            return JsonResponse({'status': False}, status=200)
        new_username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')

        if CustomUser.objects.filter(username=new_username).exclude(id=user.id).exists():
            return JsonResponse({'status': False, 'message': 'Username already taken'}, status=200)
        if CustomUser.objects.filter(email=email).exclude(id=user.id).exists():
            return JsonResponse({'status': False, 'message': 'Email already taken'}, status=200)
        if  not new_username or not first_name or not last_name or not email:
            return JsonResponse({'status': False, 'message': 'All fields are required'}, status=200)
        user.username = new_username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()
        return JsonResponse({'status': True}, status=200)
    else:
        return JsonResponse({'status': False}, status=405)


def change_profile(request):
    if request.method == 'POST':
        user = login_required(request)
        if not user:
            return JsonResponse({'status': False}, status=200)
        photo_profile = request.FILES.get('image')
        if not photo_profile:
            return JsonResponse({'status': False, 'message': 'Image is required'}, status=200)
        user.photo_profile = photo_profile
        user.save()
        return JsonResponse({'status': True}, status=200)
    else:
        return JsonResponse({'status': False}, status=200)


def change_password(request):
    if request.method != 'POST':
        return JsonResponse({'status': False}, status=405)
    user = login_required(request)
    old_password = request.POST.get('old_password')
    new_password = request.POST.get('new_password')
    confirm_password = request.POST.get('confirm_password')
    if not user.check_password(old_password):
        return JsonResponse({'status': False, 'message': 'Old password was incorrect'}, status =200)
    if new_password != confirm_password:
        return JsonResponse({'status': False, 'message': 'Confirm password was incorrect'}, status=200)
    user.set_password(new_password)
    """ update the session token """
    update_session_auth_hash(request, user)
    user.save()
    return JsonResponse({'status': True}, status=200)


@csrf_exempt
def csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token}, status=200)