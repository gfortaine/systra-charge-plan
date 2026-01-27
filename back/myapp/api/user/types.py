import strawberry
import strawberry_django
from django.db.models import QuerySet

from .filters import (
    UserFilter,
    UserOrder,
)
from ..typing import Info
from ... import models


@strawberry_django.type(models.User, filters=UserFilter, ordering=UserOrder)
class User:
    id: strawberry.auto
    username: strawberry.auto
    first_name: strawberry.auto
    last_name: strawberry.auto
    email: strawberry.auto
    last_login: strawberry.auto

    @classmethod
    def get_queryset(cls, queryset: QuerySet, info: Info, **kwargs) -> QuerySet:
        return queryset.filter(is_active=True)

    @strawberry.field
    @staticmethod
    def full_name(self: models.User) -> str:
        return str(self)

    @strawberry.field
    def has_already_been_loggedin(self) -> bool:
        return self.last_login is not None


@strawberry_django.input(models.User)
class UserInput:
    id: strawberry.auto
    username: strawberry.auto


@strawberry_django.input(models.User, partial=True)
class UserPartialInput(UserInput):
    ...
