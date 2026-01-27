import strawberry
from django.db.models import (
    Q,
    QuerySet,
)

from ..queries import (
    StrFilterLookup,
    apply_filter,
    filter_field,
    filter_type,
    order_type,
)
from ..typing import Info
from ... import models


@filter_type(models.Comment, lookups=True)
class CommentFilter:
    id: strawberry.auto
    text: strawberry.auto
    date: strawberry.auto

    @filter_field
    def author_username(self, info: Info, queryset: QuerySet, value: StrFilterLookup[str] | None, prefix: str) -> tuple[QuerySet, Q]:
        return apply_filter(queryset, value, prefix, 'author__username', info)


@order_type(models.Comment)
class CommentOrder:
    date: strawberry.auto
