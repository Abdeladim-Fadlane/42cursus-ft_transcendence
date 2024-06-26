from django.urls import path, reverse_lazy, reverse
from . import views
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('registerview/', views.RegisterPage, name='registerview'),
    path('registeruser/', views.RegisterUser, name='registerUser'),
    path('login/', views.LoginUser, name='loginUser'),
    path('loginview/', views.LoginPage, name='loginview'),
    path('logout/', views.logoutUser, name='logoutUser'),
    path('updateInformation/', views.UpdateInformationPage, name='updateInformation'),
    path('editInforamtion/', views.EditInforamtion, name='EditInforamtion'),
    path('viewProfile/', views.ViewProfile, name='viewProfile'),
    path('sendRequest/', views.SendRequest, name='sendRequest'),
    path('deleteRequest/', views.delete_requestFriend, name='deleterequest'),
    path('addUserAsFrined/', views.addUser_As_Friend, name='addUserAsFrined'),
    path('changePassword/', auth_views.PasswordChangeView.as_view(success_url=reverse_lazy('viewProfile')), name='password_change'),
    # path('changePassword/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('', views.home, name='home'),
    path('reset_password/', auth_views.PasswordResetView.as_view(), name='reset_password'),
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset_done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)