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


@filter_type(models.Post, lookups=True)
class PostFilter:
    id: strawberry.auto
    title: strawberry.auto
    text: strawberry.auto
    pubdate: strawberry.auto

    @filter_field
    def search(self, queryset: QuerySet, value: str, prefix: str) -> tuple[QuerySet, Q]:
        return apply_filter(queryset, value, prefix, (
            'title__icontains',
            'text__icontains',
            'author__first_name__icontains',
            'author__last_name__icontains',
            'author__username__icontains',
        ))

    @filter_field
    def author_email(self, info: Info, queryset: QuerySet, value: StrFilterLookup[str], prefix: str) -> tuple[QuerySet, Q]:
        return apply_filter(queryset, value, prefix, 'author__email', info)


@order_type(models.Post)
class PostOrder:
    title: strawberry.auto
    text: strawberry.auto
    pubdate: strawberry.auto
