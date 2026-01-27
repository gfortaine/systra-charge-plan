import strawberry
import strawberry_django

from .types import Category
from ..mutations import (
    CreateMutation,
    DeleteMutation,
    UpdateMutation,
)
from ..typing import Info
from ... import models


@strawberry_django.input(models.Category)
class CategoryCreateInput:
    name: strawberry.auto


class CreateCategoryMutation(CreateMutation[models.Category]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Category, CategoryCreateInput, *args, **kwargs)

    def mutate(self, source, info: Info, data: CategoryCreateInput) -> models.Category:
        return models.Category.objects.create(name=data.name)


@strawberry_django.input(models.Category, partial=True)
# or @strawberry_django.partial(models.Category)
class CategoryUpdateInput(CategoryCreateInput):
    ...


class UpdateCategoryMutation(UpdateMutation[models.Category]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Category, CategoryUpdateInput, *args, **kwargs)

    def mutate(self, source, info: Info, obj: models.Category, data: CategoryUpdateInput) -> models.Category:
        category = obj
        if data.name is not strawberry.UNSET:
            category.name = data.name
        category.save()
        return category


class DeleteCategoryMutation(DeleteMutation[models.Category]):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('extensions', [])  # set your permisions here
        super().__init__(Category, *args, **kwargs)

    def mutate(self, source, info: Info, obj: models.Category) -> models.Category:
        obj.delete()
        return obj


create_category = CreateCategoryMutation()
update_category = UpdateCategoryMutation()
delete_category = DeleteCategoryMutation()
