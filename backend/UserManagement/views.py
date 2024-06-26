from django.shortcuts import render, redirect
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.forms import UserChangeForm, UserChangeForm
from .forms import UserForm, Userchange
from django.contrib import messages
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
# Create your views here.

def RegisterPage(request):
    if (request.user.is_authenticated == True):
        messages.warning(request,"you are already login")
        return redirect('viewProfile')
    return render(request, 'UserManagement/register.html', {'form' : UserForm})

@login_required(login_url='loginUser')
def UpdateInformationPage(request):
    if (request.user.is_authenticated == False):
        return redirect('loginview')
    user_profile = UserProfile.objects.get(user=request.user)
    return render(request, "UserManagement/update.html", {'form' : Userchange, 'user': request.user, 'user_profile' : user_profile})

@login_required(login_url='loginUser')
def EditInforamtion(request):
    if (request.method == "POST"):
        update_info = Userchange(request.POST, instance=request.user)
        user_profile = UserProfile.objects.get(user=request.user)  
        if (update_info.is_valid() == True):
            update_info.save()
            if (request.FILES.get('photo_profile')):
                user_profile.photo_profile = request.FILES.get('photo_profile')
                user_profile.save()
            messages.success(request, "update the information with success")
            return redirect('viewProfile')
        else :
            # messages.error(request,)
            return render(request, 'UserManagement/update.html', {'form' : update_info, 'user_profile' : user_profile})

def LoginPage(request):
    if (request.user.is_authenticated == True):
        messages.warning(request, "you are already login")
        return redirect('viewProfile')
    return render(request, "UserManagement/loginPage.html", {'form' : UserForm()})

def LoginUser(request):
    if (request.user.is_authenticated == True):
        return redirect('viewProfile')
    else:
        if (request.method == 'POST'):
            username_enter = request.POST.get('username')
            password_enter = request.POST.get('password')
            user_login = authenticate(username=username_enter,password=password_enter)
            if (user_login is not None):
                login(request, user_login)
                return redirect('viewProfile')
            else:
                messages.error(request, "Username or Password is incorrect")
                return render(request, "UserManagement/loginPage.html", {'form' : UserForm()})
            
@login_required(login_url='loginUser')
def logoutUser(request):
    logout(request)
    messages.success(request, "you are logout with succes")
    return redirect('home')

def RegisterUser(request):
    if (request.method == "POST"):
        new_user = UserForm(request.POST)
        _user_profile = UserProfile()
        # user_friends = UserFriend()
        if (new_user.is_valid() == True):
            new_user = new_user.save()
            _user_profile.user = new_user
            if (request.FILES.get('photo_profile')):
                _user_profile.photo_profile = request.FILES.get('photo_profile')
            _user_profile = _user_profile.save()
            return redirect('loginview')
        else :
            return render(request, 'UserManagement/register.html', {'form' : new_user})
    else :
        return redirect('home')
     

@login_required(login_url='loginUser') 
def ViewProfile(request):
    if (request.user.is_authenticated == True):
        photo = UserProfile.objects.get(user=request.user)
        friends = UserProfile.objects.all()
        friend = UserFriend.objects.filter(user=request.user)
        _user_suggestion = Request_friend.objects.filter(user_suggestion=request.user)
        user_info = {
            'user_info': request.user,
            'user_profile': photo,
            'users_friend' : friends,
            'request_Friend' : _user_suggestion,
            'friends' : friend 
                     } 
        return render(request, 'UserManagement/homePage.html', user_info)
    else:
        return redirect('loginview')

@login_required(login_url='loginUser')  
def SendRequest(request):
    if (request.method == "POST"):
        suggestion_friend = User.objects.get(
        username=request.POST.get('username')
            )
        if UserFriend.objects.filter(user=request.user, friend=suggestion_friend).exists() == False:
            request_user = Request_friend(
                request_user=request.user,
                user_suggestion=suggestion_friend,
                )
            if Request_friend.objects.filter(request_user=request.user, 
                user_suggestion=suggestion_friend).exists() == False and Request_friend.objects.filter( request_user=suggestion_friend, 
                        user_suggestion=request.user).exists() == False:
                request_user.save()
    return redirect('viewProfile')

@login_required(login_url='loginUser')  
def addUser_As_Friend(request):
    if (request.method == "POST"):
        _friend = User.objects.get(username=request.POST.get('username')) 
        if (Request_friend.objects.filter(request_user=_friend, 
                user_suggestion=request.user).exists() == True 
                and UserFriend.objects.filter(user=request.user, friend=_friend).exists() == False) :
            user_friend = UserFriend(user=request.user, friend=_friend)
            user_friend.save()
            UserFriend(user=_friend, friend=request.user).save()
            Request_friend.objects.filter(request_user=_friend, 
                user_suggestion=request.user).delete()
    return redirect('viewProfile')


@login_required(login_url='loginUser')  
def delete_requestFriend(request):
    request_friend = User.objects.get(username=request.POST.get('username'))
    _request = Request_friend.objects.filter(request_user=request_friend, 
            user_suggestion=request.user)
    if (_request.exists() == True):
        _request.delete()
    return redirect('viewProfile')

@login_required(login_url='loginUser')  
def unfriend_user(request):
    _friend = User.objects.get(username=request.POST.get('username'))
    relation = UserFriend.objects.filter(user=request.user,friend=_friend)
    if (relation.exists() == True):
        relation.delete()
        relation = UserFriend.objects.filter(user=_friend,friend=request.user)
        if (relation.exists() == True):
            relation.delete()
    return redirect('viewProfile')
def home(request):
    return render(request, "UserManagement/home.html")

