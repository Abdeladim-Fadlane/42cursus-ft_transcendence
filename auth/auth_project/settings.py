import os
from pathlib import Path
from dotenv import load_dotenv  # type: ignore

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = True

# Secret key from environment variable or default
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '12121--34-5-345-0???$?@?2&^$%^#$*)')
ALLOWED_HOSTS = ['*']

# Allowed hosts configuration
# ALLOWED_HOSTS = [
#     'localhost',
#     '127.0.0.1',
#     'psychic-chainsaw-76q55ppp5573p6g6.github.dev',
#     'psychic-chainsaw-76q55ppp5573p6g6-443.app.github.dev',
#     'auth'
# ]

# Installed applications
INSTALLED_APPS = [
    "daphne",
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'auth_app',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
]

AUTH_USER_MODEL = 'auth_app.CustomUser'

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # Change to False for security
CORS_ALLOWED_ORIGINS = [
    'https://psychic-chainsaw-76q55ppp5573p6g6.github.dev',
    'https://localhost:443',  # Include this for local requests
]

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    'https://psychic-chainsaw-76q55ppp5573p6g6.github.dev',
    'https://localhost:443',  # Add this line if you're testing locally
]


# Middleware configuration
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Place CORS middleware at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# REST framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
}

# URL configuration
ROOT_URLCONF = 'auth_project.urls'

# Authentication settings
LOGIN_URL = '/'
LOGIN_REDIRECT_URL = '/'

# Channel layers configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
        },
    },
}

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_NAME'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('AUTH_HOST'),
        'PORT': os.environ.get('POSTGRES_PORT'),
    }
}

# Security settings
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Localization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files configuration
STATIC_URL = '/static/'

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Site ID (if using Django sites framework)
SITE_ID = 2

# Password validators
AUTH_PWD_MODULE = "django.contrib.auth.password_validation."
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": f"{AUTH_PWD_MODULE}UserAttributeSimilarityValidator",
    },
    {
        "NAME": f"{AUTH_PWD_MODULE}MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        }
    },
    {
        "NAME": f"{AUTH_PWD_MODULE}CommonPasswordValidator",
    },
    {
        "NAME": f"{AUTH_PWD_MODULE}NumericPasswordValidator",
    },
]

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI and ASGI applications
WSGI_APPLICATION = 'auth_project.wsgi.application'
ASGI_APPLICATION = 'auth_project.asgi.application'
