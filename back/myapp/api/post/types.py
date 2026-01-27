from typing import (
    TYPE_CHECKING,
    Annotated,
)

import strawberry
import strawberry_django

from .filters import (
    PostFilter,
    PostOrder,
)
from ... import models

if TYPE_CHECKING:
    from ..category.types import Category
    from ..comment.types import Comment
    from ..user.types import User


@strawberry_django.type(models.Post, filters=PostFilter, ordering=PostOrder)
class Post:
    id: strawberry.auto
    title: strawberry.auto
    text: strawberry.auto
    pubdate: strawberry.auto
    author: Annotated['User', strawberry.lazy('..user.types')]
    categories: list[Annotated['Category', strawberry.lazy('..category.types')]]
    comments: list[Annotated['Comment', strawberry.lazy('..comment.types')]]

    @strawberry.field
    @staticmethod
    def image_url(self: models.Post) -> str | None:
        return self.image.url if self.image else None
