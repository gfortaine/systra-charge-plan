from typing import (
    TYPE_CHECKING,
    Annotated,
)

import strawberry
import strawberry_django

from .filters import (
    CategoryFilter,
    CategoryOrder,
)
from ..queries import django_field
from ... import models

if TYPE_CHECKING:
    from ..post.types import Post


@strawberry_django.type(models.Category, filters=CategoryFilter, ordering=CategoryOrder)
class Category:
    id: strawberry.auto
    name: strawberry.auto
    posts: list[Annotated['Post', strawberry.lazy('..post.types')]] = django_field(pagination=True)
