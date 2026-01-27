import strawberry
from strawberry.extensions import ParserCache
from strawberry_django.optimizer import DjangoOptimizerExtension

from .category.mutations import (
    create_category,
    delete_category,
    update_category,
)
from .category.queries import (
    all_categories,
    one_category,
)
from .comment.mutations import (
    create_comment,
    delete_comment,
    update_comment,
)
from .comment.queries import (
    all_comments,
    one_comment,
)
from .post.mutations import (
    create_post,
    delete_post,
    update_post,
)
from .post.queries import (
    all_posts,
    one_post,
)
from .user.queries import (
    all_users,
    current_user,
    one_user,
)
from ..utils.version import version


@strawberry.type
class Query:
    @strawberry.field
    def version(self) -> str:
        return version
    me = current_user
    user = one_user
    all_users = all_users
    category = one_category
    all_categories = all_categories
    post = one_post
    all_posts = all_posts
    comment = one_comment
    all_comments = all_comments


@strawberry.type
class Mutation:
    create_category = create_category
    update_category = update_category
    delete_category = delete_category
    create_post = create_post
    update_post = update_post
    delete_post = delete_post
    create_comment = create_comment
    update_comment = update_comment
    delete_comment = delete_comment


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
        ParserCache(maxsize=100),
    ],
)
