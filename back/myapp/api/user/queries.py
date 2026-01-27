from typing import cast

from strawberry_django.auth.queries import resolve_current_user

from .types import User
from ..queries import (
    DjangoQuery,
    django_field,
)
from ..typing import Info


def gen_extensions():
    return []  # put your permissions checks here


@django_field(extensions=gen_extensions())
def current_user(info: Info) -> User:
    user = resolve_current_user(info)
    assert user
    return cast(User, user)


one_user = DjangoQuery(User, extensions=gen_extensions())
all_users = DjangoQuery(list[User], extensions=gen_extensions())
