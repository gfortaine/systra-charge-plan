from typing import cast

import strawberry
import strawberry_django
from strawberry.file_uploads import Upload
from strawberry_django.auth.queries import resolve_current_user

from .types import Post
from ..mutations import (
    CreateMutation,
    DeleteMutation,
    UpdateMutation,
)
from ..typing import (
    Any,
    Info,
)
from ..user.types import UserPartialInput
from ... import models


@strawberry_django.input(models.Post)
class PostCreateInput:
    title: strawberry.auto
    text: strawberry.auto
    pubdate: strawberry.auto
    author: UserPartialInput | None
    categories: strawberry.auto
    image: Upload | None = strawberry.UNSET


class CreatePostMutation(CreateMutation[models.Post]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Post, PostCreateInput, *args, **kwargs)

    def mutate(self, source, info: Info, data: PostCreateInput) -> models.Post:
        params: dict[str, Any] = dict(
            title=data.title,
            text=data.text,
            image=data.image or None,  # force None if UNSET
        )
        if data.pubdate is not strawberry.UNSET:
            params['pubdate'] = data.pubdate
        if data.author is None or data.author is strawberry.UNSET:
            params['author_id'] = resolve_current_user(info).pk
        elif data.author.id is not strawberry.UNSET:
            params['author_id'] = data.author.id
        elif data.author.username is not strawberry.UNSET:
            params['author_id'] = models.User.objects.get(username=data.author.username).pk
        else:
            raise ValueError("id or username should be provided for author")
        post = models.Post.objects.create(**params)
        if data.categories is not strawberry.UNSET:
            if (to_set := data.categories.set) is not strawberry.UNSET:
                post.categories.set(to_set)
            if (to_add := data.categories.add) is not strawberry.UNSET and to_add:
                post.categories.add(*to_add)
            if (to_remove := data.categories.remove) is not strawberry.UNSET and to_remove:
                post.categories.remove(*to_remove)
        return post


@strawberry_django.input(models.Post, partial=True)
# or @strawberry_django.partial(models.Post)
class PostUpdateInput(PostCreateInput):
    ...


class UpdatePostMutation(UpdateMutation[models.Post]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Post, PostUpdateInput, *args, **kwargs)

    def mutate(self, source, info: Info, obj: models.Post, data: PostUpdateInput) -> models.Post:
        post = obj
        if data.title is not strawberry.UNSET:
            post.title = data.title
        if data.text is not strawberry.UNSET:
            post.text = data.text
        if data.image is not strawberry.UNSET:
            post.image = data.image
        if data.pubdate is not strawberry.UNSET:
            post.pubdate = data.pubdate
        if data.author is not strawberry.UNSET:
            if data.author is None:
                author_id = cast(models.User, resolve_current_user(info)).pk
            elif data.author.id is not strawberry.UNSET:
                author_id = data.author.id
            elif data.author.username is not strawberry.UNSET:
                author_id = models.User.objects.get(username=data.author.username).pk
            else:
                raise ValueError("id or username should be provided for author")
            post.author_id = author_id
        post.save()
        if data.categories is not strawberry.UNSET:
            if (to_set := data.categories.set) is not strawberry.UNSET:
                post.categories.set(to_set)
            if (to_add := data.categories.add) is not strawberry.UNSET and to_add:
                post.categories.add(*to_add)
            if (to_remove := data.categories.remove) is not strawberry.UNSET and to_remove:
                post.categories.remove(*to_remove)
        return post


class DeletePostMutation(DeleteMutation[models.Post]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Post, *args, **kwargs)

    def mutate(self, source, info: Info, obj: models.Post) -> models.Post:
        obj.delete()
        return obj


create_post = CreatePostMutation()
update_post = UpdatePostMutation()
delete_post = DeletePostMutation()
