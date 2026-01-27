from .types import Category
from ..queries import DjangoQuery


def gen_extensions():
    return []  # put your permissions checks here


one_category = DjangoQuery(Category, extensions=gen_extensions())
all_categories = DjangoQuery(list[Category], extensions=gen_extensions(), pagination=False)
