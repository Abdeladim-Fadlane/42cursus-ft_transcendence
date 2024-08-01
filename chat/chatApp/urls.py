from django.urls import path
from . import views


urlpatterns = [
    path("DisplayMsg/<str:room_name>/", views.MessageHistory),
    path("Converstaion/<str:room_name>/", views.retrun_conversation),
    path("blockFriend/", views.block_user),
    path("chatCsrftoken/", views.csrf_token),
    path("delete_conversation/<str:username>/", views.delete_conversation),
    path("readMessage/", views.Message_readed),
    path("NotReaded/", views.getAllConversation),
    path("MessageUsers/", views.getAllConversationMessage),
]