from .types import Comment
from ..queries import DjangoQuery


def gen_extensions():
    return []  # put your permissions checks here


one_comment = DjangoQuery(Comment, extensions=gen_extensions())
all_comments = DjangoQuery(list[Comment], extensions=gen_extensions())
