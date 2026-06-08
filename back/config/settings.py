"""
Django settings for project.
"""
from os import getenv
from pathlib import Path
from socket import (
    gaierror,
    gethostbyname_ex,
    gethostname,
)
from typing import overload

from django_pdb.middleware import PdbMiddleware


@overload
def from_env(key: str, default: bool) -> bool: ...  # noqa: E704
@overload
def from_env(key: str, default: str) -> str: ...  # noqa: E704
@overload
def from_env(key: str, default: None) -> str | None: ...  # noqa: E704
@overload
def from_env(key: str) -> str | None: ...  # noqa: E704


def from_env(key: str, default: str | bool | None = None) -> str | bool | None:
    match default:
        case str():
            return getenv(key, default)
        case bool():
            return getenv(key, str(default)).lower() in ('true', '1', 'on')
        case None:
            return getenv(key)


BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
# Use `./back/manage.py generate_secret_key` to generate a new one
SECRET_KEY = from_env('DJANGO_SECRET_KEY', 'django-insecure-1l_c9eu$a5%8+@m(=1bv6on!m*b(z^w0yk9pc--nhcw61hm#^s')
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = from_env('DJANGO_DEBUG', False)
DJANGO_VITE_DEV_MODE = from_env('DJANGO_VITE_DEV_MODE', False)
FORCE_SERVE_STATIC = from_env('DJANGO_FORCE_SERVE_STATIC', False)
# https://github.com/HassenPy/django-pdb/issues/55
if not hasattr(PdbMiddleware, 'async_mode'):
    setattr(PdbMiddleware, '_is_coroutine', False)
    setattr(PdbMiddleware, 'async_mode', False)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {  # catch all for all loggers
        'handlers': ['console'],
        'level': 'DEBUG' if DEBUG else 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': from_env('DJANGO_LOG_LEVEL', 'INFO' if DEBUG else 'WARNING'),
            'propagate': False,
        },
        'psycopg.pq': {
            'level': 'ERROR',
        },
        'oauth2_authcodeflow': {
            'level': from_env('OAUTH2_LOG_LEVEL', 'DEBUG' if DEBUG else 'ERROR'),
        },
        'werkzeug': {
            'handlers': ['console'],
            'level': from_env('DJANGO_RUNSERVER_LOG_LEVEL', 'DEBUG' if DEBUG else 'INFO'),
            'propagate': False,
        },
        'watchdog': {
            'level': 'ERROR',
        },
        'asyncio': {
            'level': 'WARNING',
        },
        'flake8': {
            'level': 'ERROR',
        },
        'numpy': {
            'level': 'ERROR',
        },
    },
}

ALLOWED_HOSTS = ['*']
INTERNAL_IPS = [
    '127.0.0.1',
]
if DEBUG:
    try:
        INTERNAL_IPS += [
            # tricks to have debug toolbar when developing with docker
            *[ip[:-1] + '1' for ip in gethostbyname_ex(gethostname())[2]]
        ]
    except gaierror:
        pass

INSTALLED_APPS = [
    'django_pdb',
    'django_extensions',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'strawberry_django',
    'djvite',
    'myapp',
]
WITH_DEBUG_TOOLBAR = False
if DEBUG and from_env('DJANGO_WITH_DEBUG_TOOLBAR', True):
    try:
        import debug_toolbar
        assert debug_toolbar
        INSTALLED_APPS.append('debug_toolbar')
        WITH_DEBUG_TOOLBAR = True
    except ImportError:
        pass

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_pdb.middleware.PdbMiddleware',
]
if WITH_DEBUG_TOOLBAR:
    MIDDLEWARE.append('strawberry_django.middlewares.debug_toolbar.DebugToolbarMiddleware')

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': {
            'postgresql': 'django.db.backends.postgresql',
            'sqlite': 'django.db.backends.sqlite3',
        }[from_env('DJANGO_DB_TYPE', 'postgresql')],
        'HOST': from_env('DJANGO_DB_HOST', 'db'),
        'PORT': from_env('DJANGO_DB_PORT', '5432'),
        'NAME': BASE_DIR / 'db' / 'myapp.sqlite' if from_env('DJANGO_DB_TYPE', 'postgresql') == 'sqlite' else 'myapp',
        'USER': 'myapp',
        'PASSWORD': 'myapp',
    }
}
# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'myapp.User'

# Graphql
STRAWBERRY_DJANGO = {
    'FIELD_DESCRIPTION_FROM_HELP_TEXT': True,
    'TYPE_DESCRIPTION_FROM_MODEL_DOCSTRING': True,
    'GENERATE_ENUMS_FROM_CHOICES': True,
}

# Security and checks
SESSION_COOKIE_AGE = 30 * 86400  # 30 days
if not from_env('DJANGO_NO_HTTPS', False):
    SECURE_HSTS_SECONDS = 365 * 86400  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
SILENCED_SYSTEM_CHECKS = []
SILENCED_SYSTEM_CHECKS.append('security.W008')  # SECURE_SSL_REDIRECT is not True
SILENCED_SYSTEM_CHECKS.append('security.W018')  # DJANGO_DEBUG is not False

# Oauth2
OIDC_RP_CLIENT_ID = from_env('OIDC_RP_CLIENT_ID')
OIDC_RP_CLIENT_SECRET: str | None = from_env('OIDC_RP_CLIENT_SECRET')
if OIDC_RP_CLIENT_ID:
    INSTALLED_APPS.append('oauth2_authcodeflow')
    MIDDLEWARE.extend([
        'oauth2_authcodeflow.middleware.LoginRequiredMiddleware',
        'oauth2_authcodeflow.middleware.RefreshAccessTokenMiddleware',
        'oauth2_authcodeflow.middleware.RefreshSessionMiddleware',
    ])
    AUTHENTICATION_BACKENDS = [
        'oauth2_authcodeflow.auth.AuthenticationBackend',
        'django.contrib.auth.backends.ModelBackend',
    ]
    AZURE_TENANT_ID = from_env('AZURE_TENANT_ID', 'f7e124e1-3cbb-4714-b90e-d08652874b65')
    OIDC_OP_DISCOVERY_DOCUMENT_URL = '/'.join((
        from_env('OIDC_OP_MAIN_URL', f'https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0'),
        '.well-known',
        'openid-configuration'
    ))
    OIDC_OP_TOTAL_LOGOUT = False
    OIDC_RP_FORCE_SECRET_WITH_PKCE = True  # depends on the RP configuration
    OIDC_RP_FORCE_NO_CONSENT_PROMPT = True
    # OIDC_RP_AZURE_SPA = True  # if RP is Azure and SPA is configured instead of WebApp
    # given_name and family_name might be null
    OIDC_OP_EXPECTED_CLAIMS = ['email']
    OIDC_FIRSTNAME_CLAIM = lambda claims: claims.get('given_name', '')  # noqa E731
    OIDC_LASTNAME_CLAIM = lambda claims: claims.get('family_name', claims.get('name', ''))  # noqa E731
    # use the oid field (UUID) from Azuze for username
    OIDC_DJANGO_USERNAME_FUNC = lambda claims: claims['oid']  # noqa: E731
    OIDC_RP_SCOPES = ['openid', 'email', 'profile', 'offline_access']
    OIDC_MIDDLEWARE_LOGIN_REQUIRED_REDIRECT = False
    OIDC_MIDDLEWARE_NO_AUTH_URL_PATTERNS = [
        '^/favicon.ico$',
        '^/admin/',
        '^/version',
        '^/$',
        '^/login$',
        '^/__debug__/',
    ]
    OIDC_MIDDLEWARE_API_URL_PATTERNS = ['^/graphql/']
    OIDC_MIDDLEWARE_SESSION_TIMEOUT_SECONDS = SESSION_COOKIE_AGE - 3600  # 30 days minus 1 hour

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
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

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = 'en-us'
LOCALE_PATHS = [BASE_DIR / 'myapp' / 'locale']
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_TZ = True

# If proxied, which is often the case
USE_X_FORWARDED_HOST = True

# CORS
# https://github.com/OttoYiu/django-cors-headers#configuration
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Shell plus
SHELL_PLUS_POST_IMPORTS = [
    ('pprint', 'pprint'),
    ('inspect', 'getsource'),
    ('django.db.models', 'Subquery'),
    ('django.db.models', 'OuterRef'),
    ('strawberry'),
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'
DJVITE = {
    'DEV_MODE': DJANGO_VITE_DEV_MODE,
    'VITE_MANIFEST_PATH': BASE_DIR.parent / 'front' / 'vite.manifest.json',
    'MODULE_EXTS': ['.js', '.jsx'],
}
STATICFILES_DIRS = []
if (dist_path := BASE_DIR.parent / 'front' / 'dist').exists():
    STATICFILES_DIRS.append(dist_path)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

RUNSERVERPLUS_POLLER_RELOADER_TYPE = 'stat'
RUNSERVER_PLUS_EXCLUDE_PATTERNS = [
    str(STATIC_ROOT) + '/*',
    str(MEDIA_ROOT) + '/*',
    *[str(static_dir) + '/*' for static_dir in STATICFILES_DIRS],
]
