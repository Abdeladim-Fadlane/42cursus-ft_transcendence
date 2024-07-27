from .views import TaskListCreateAPIView, TaskRetrieveUpdateDestroyAPIView
from .views import MatchListCreateAPIView
from django.urls import path
from django.urls import path
from . import views , login ,api


urlpatterns = [
    path('csrf-token/', login.csrf_token),
    path('redirect/', views.redirect_to_42, name='redirect_to_42'),
    path('auth/callback/', views.callback, name='callback'),
    path('logout/',login.logout,name='logout'),
    path('tasks/', TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyAPIView.as_view(), name='task-retrieve-update-destroy'),
    path('match/', MatchListCreateAPIView.as_view(), name='match-list-create'),
    path('data/', login.data, name='data'),
    path('token/', login.token, name='session'),
    path('update_profile/', login.update_profile, name='update_profile'),
    path('already_logged/', login.already_logged, name='already_logged'),
    path('registeruser/', views.SignUp, name='registerUser'),
    path('loginuser/', views.SignIn, name='loginUser'),
    path('leaderboard/', login.leadrboard, name='leaderboard'),
    path('history/', login.get_match_history, name='get_match_history'),
    path('suggest/', api.suggest_friend, name='suggest'),
    path('send_request/', api.send_friend_request, name='send_request'),
    path('accept_request/', api.accept_friend_request, name='accept_request'),
    path('reject_request/', api.reject_friend_request, name='reject_request'),
    path('get_requests/', api.get_friend_requests, name='get_requests'),
    path('friends/', api.get_friends, name='get_friends'),
    path('reject_friend/', api.reject_friend_request, name='reject_friend'),
    path('delete_friend/', api.delete_friend, name='delete_friend'),
    path('online/', api.online_friends, name='online'),
    path('friend/', api.frined_profile, name='profile'),
    path('delete_account/', api.delete_account, name='delete account'),
    path('users/', api.getAllUser, name='users'),
    path('change_password/', login.change_password, name='change_password'),
    path('change_profile/', login.change_profile, name='change_profile'),
    path('display_name/', login.set_display_name, name='display_name'),
]