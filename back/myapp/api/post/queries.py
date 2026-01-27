from .types import Post
from ..queries import DjangoQuery


def gen_extensions():
    return []  # put your permissions checks here


one_post = DjangoQuery(Post, extensions=gen_extensions())
all_posts = DjangoQuery(list[Post], extensions=gen_extensions())
