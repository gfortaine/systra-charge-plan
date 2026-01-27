from typing import (
    TYPE_CHECKING,
    Annotated,
)

import strawberry
import strawberry_django

from .filters import (
    CommentFilter,
    CommentOrder,
)
from ... import models

if TYPE_CHECKING:
    from ..post.types import Post
    from ..user.types import User


@strawberry_django.type(models.Comment, filters=CommentFilter, ordering=CommentOrder)
class Comment:
    id: strawberry.auto
    post: Annotated['Post', strawberry.lazy('..post.types')]
    text: strawberry.auto
    date: strawberry.auto
    author: Annotated['User', strawberry.lazy('..user.types')]
