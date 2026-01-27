import strawberry

from ..queries import (
    filter_type,
    order_type,
)
from ... import models


@filter_type(models.Category, lookups=True)
class CategoryFilter:
    name: strawberry.auto


@order_type(models.Category)
class CategoryOrder:
    name: strawberry.auto
