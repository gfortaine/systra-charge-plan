from typing import TypeAlias

from django.contrib.auth.models import (
    AbstractUser,
    AnonymousUser,
)
from django.http import HttpRequest

from ..api.typing import Info

User: TypeAlias = AbstractUser | AnonymousUser

__all__ = [
    'AnonymousUser',
    'HttpRequest',
    'User',
    'Info',
]
