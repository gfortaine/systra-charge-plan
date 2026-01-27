import strawberry
import strawberry_django
from django.utils.timezone import now
from strawberry_django.auth.queries import resolve_current_user

from .types import Comment
from ..mutations import (
    CreateMutation,
    DeleteMutation,
    UpdateMutation,
)
from ..typing import Info
from ... import models


@strawberry_django.input(models.Comment)
class CommentCreateInput:
    # `strawberry.auto` will allow to modify the post by using a OneToManyInput
    # as only a Post reference is required, explicit ID is used
    post_id: strawberry.ID
    text: strawberry.auto
    date: strawberry.auto
    # Here setting author is authorized.
    # A OneToManyInput type will be used and required. `set` will contains a author_id, or null
    author: strawberry.auto


class CreateCommentMutation(CreateMutation[models.Comment]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Comment, CommentCreateInput, *args, **kwargs)

    def mutate(self, source, info: Info, data: CommentCreateInput) -> models.Comment:
        if data.date in (strawberry.UNSET, None):
            data.date = now()
        assert data.date
        if data.author.set in (strawberry.UNSET, None):
            data.author.set = resolve_current_user(info)
        else:
            data.author.set = models.User.objects.get(pk=data.author.set)
        assert data.author
        return models.Comment.objects.create(
            post_id=data.post_id,
            text=data.text,
            date=data.date,
            author=data.author.set,
        )


@strawberry_django.input(models.Comment, partial=True)
# or @strawberry_django.partial(models.Comment)
class CommentUpdateInput:
    text: strawberry.auto
    date: strawberry.auto
    author: strawberry.auto


class UpdateCommentMutation(UpdateMutation[models.Comment]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Comment, CommentUpdateInput, *args, **kwargs)

    def mutate(self, source, info: Info, obj: models.Comment, data: CommentUpdateInput) -> models.Comment:
        comment = obj
        if data.text is not strawberry.UNSET:
            comment.text = data.text
        if data.date is not strawberry.UNSET:
            comment.date = data.date
        if data.author and data.author.set is not strawberry.UNSET:
            comment.author_id = data.author.set
        comment.save()
        return comment


class DeleteCommentMutation(DeleteMutation[models.Comment]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Comment, *args, **kwargs)

    def mutate(self, source, info: Info, obj: models.Comment) -> models.Comment:
        obj.delete()
        return obj


create_comment = CreateCommentMutation()
update_comment = UpdateCommentMutation()
delete_comment = DeleteCommentMutation()
