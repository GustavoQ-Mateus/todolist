from .base import *
from decouple import config

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
