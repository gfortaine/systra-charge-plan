import strawberry
from django.db.models import (
    Q,
    QuerySet,
)

from ..queries import (
    apply_filter,
    filter_field,
    filter_type,
    order_type,
)
from ... import models


@filter_type(models.User, lookups=True)
class UserFilter:
    id: strawberry.auto
    username: strawberry.auto
    email: strawberry.auto
    first_name: strawberry.auto
    last_name: strawberry.auto

    @filter_field
    def full_name(self, queryset: QuerySet, value: str, prefix: str) -> tuple[QuerySet, Q]:
        return apply_filter(queryset, value, prefix, ('first_name__icontains', 'last_name__icontains'))

    @filter_field
    def part_name(self, queryset: QuerySet, value: str, prefix: str) -> tuple[QuerySet, Q]:
        return apply_filter(queryset, value, prefix, ('first_name__icontains', 'last_name__icontains', 'username__icontains'))


@order_type(models.User)
class UserOrder:
    username: strawberry.auto
    email: strawberry.auto
    last_name: strawberry.auto
    first_name: strawberry.auto
