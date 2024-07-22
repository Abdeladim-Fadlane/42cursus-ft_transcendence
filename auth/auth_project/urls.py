from django.contrib import admin
from django.urls import path,include
from django.views.generic import TemplateView
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('auth_app.urls')),
    path('login/', include('auth_app.urls')), 
    path('auth/callback/', include('auth_app.urls')),  
    path('redirect/', include('auth_app.urls')),  
    path('logout/', include('auth_app.urls')),
    path('game/', include('auth_app.urls')),
    path('api/', include('auth_app.urls')),
    path('account/', include('auth_app.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

