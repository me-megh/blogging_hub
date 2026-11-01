import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")


# Security
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-local-development-only"
)

DEBUG = os.environ.get("DEBUG", "False").lower() == "true"


ALLOWED_HOSTS = [
    'blogging-hub-backend.onrender.com',
    'blogging-hub-five.vercel.app',
    '127.0.0.1',
    'localhost',
    '0.0.0.0',
]


# Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'cloudinary_storage',
    'cloudinary',

    'blog',
    'corsheaders',
    'rest_framework',
]


# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]


ROOT_URLCONF = 'backend.urls'


# Templates
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


# WSGI
WSGI_APPLICATION = 'backend.wsgi.application'


# DATABASE CONFIGURATION
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Authentication
AUTHENTICATION_BACKENDS = [
    'blog.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}


# Internationalization
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_TZ = True


# Static files
STATIC_URL = '/static/'


# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Logout
LOGOUT_REDIRECT_URL = '/'


# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://blogging-hub-five.vercel.app',
    'https://blogging-hub-git-main-me-meghs-projects.vercel.app',
]

CORS_ALLOW_CREDENTIALS = True


# CSRF Configuration
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'https://blogging-hub-five.vercel.app',
    'https://blogging-hub-git-main-me-meghs-projects.vercel.app',
]

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_NAME = 'csrftoken'

# CSRF_COOKIE_SAMESITE = 'None'
# SESSION_COOKIE_SAMESITE = 'None'

# CSRF_COOKIE_SECURE = not DEBUG
# SESSION_COOKIE_SECURE = not DEBUG


if DEBUG:
    CSRF_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
else:
    CSRF_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SAMESITE = 'None'
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True


# Default primary key
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}