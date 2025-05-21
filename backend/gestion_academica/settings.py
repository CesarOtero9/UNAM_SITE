"""
Django settings for gestion_academica project.

Generado con Django 5.1.6.  Adaptado para despliegue en Render
y desarrollo local con SQLite.
"""

from pathlib import Path
from datetime import timedelta
import os

# ─────────────────────────────────────────────
# 1. Rutas base
# ─────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent


# ─────────────────────────────────────────────
# 2. Seguridad
# ─────────────────────────────────────────────
# SECRET_KEY:
#   • Local: usa la cadena hard-codeada si no existe var de entorno.
#   • Render: leerá DJANGO_SECRET_KEY generada en el panel.
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "llave-solo-para-desarrollo")

# DEBUG:
#   • Local: True por defecto.
#   • Render: define DJANGO_DEBUG=False para desactivarlo.
DEBUG = os.getenv("DJANGO_DEBUG", "") != "False"

ALLOWED_HOSTS = [
    "unam-site-back.onrender.com",  # URL pública Render (ajústala tras el primer deploy)
    "localhost",
    "127.0.0.1",
]


# ─────────────────────────────────────────────
# 3. Aplicaciones instaladas
# ─────────────────────────────────────────────
INSTALLED_APPS = [
    # Django core
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Terceros
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    # Propias
    "profesores",
]

# ─────────────────────────────────────────────
# 4. Middleware
# ─────────────────────────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",           # ← CORS SIEMPRE AL INICIO
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",      # ← sirve estáticos en producción
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "gestion_academica.urls"

# ─────────────────────────────────────────────
# 5. Templates
# ─────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "gestion_academica.wsgi.application"


# ─────────────────────────────────────────────
# 6. Base de datos
# ─────────────────────────────────────────────
# SQLite para desarrollo.  En producción puedes migrar a Postgres
# añadiendo dj-database-url y leyendo DATABASE_URL.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ─────────────────────────────────────────────
# 7. Password validators
# ─────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ─────────────────────────────────────────────
# 8. Internacionalización
# ─────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ─────────────────────────────────────────────
# 9. Archivos estáticos
# ─────────────────────────────────────────────
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Whitenoise: comprime y versiona estáticos para producción
STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)


# ─────────────────────────────────────────────
# 10. Clave primaria por defecto
# ─────────────────────────────────────────────
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ─────────────────────────────────────────────
# 11. DRF • JWT • CORS
# ─────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=2),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",              # React dev server
    "https://unam-site.netlify.app",      # ← tu front en producción — cámbialo si varía
]

# Si vas a usar https://*.onrender.com para frontends adicionales,
# Render exige incluirlos en CSRF_TRUSTED_ORIGINS (opcional)
CSRF_TRUSTED_ORIGINS = [
    "https://unam-site.netlify.app",
]
