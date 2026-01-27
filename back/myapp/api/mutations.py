"""
Other possibility is to use what is described here:
    https://strawberry-graphql.github.io/strawberry-graphql-django/guide/mutations/
"""
from dataclasses import asdict
from inspect import ismethod
from typing import (
    Any,
    Generic,
    TypeAlias,
    TypeVar,
    get_type_hints,
)

from django.db import transaction
from django.db.models import (
    Model,
    QuerySet,
)
from strawberry import (
    ID,
    UNSET,
)
from strawberry import mutation as strawberry_mutation
from strawberry.annotation import StrawberryAnnotation
from strawberry.types.arguments import StrawberryArgument
from strawberry.types.field import StrawberryField
from strawberry.types import Info
from strawberry_django.resolvers import django_resolver
from strawberry_django.utils.typing import (
    get_django_definition,
    has_django_definition,
)

T_Model = TypeVar("T_Model", bound=Model)
Kwargs: TypeAlias = dict[str, Any]
DataDict: TypeAlias = dict[str, Any]


class BaseMutation(Generic[T_Model], StrawberryField):
    """
    Base for all mutations.
    Mutation will always return a django model.
    One can overload the `get_queryset` method to filter the collection models to look for the object model.
    One can overload the `get_obj` method to custom how to retrieve the model from the collection.
    Subclass should implement the `get_mutate_result` method.
    """
    return_type: type
    input_type: type | None

    def __init__(self, return_type: type, input_type: type | None, /, with_pk: bool, **kwargs) -> None:
        if not has_django_definition(return_type):
            raise ValueError(f"{return_type} is not annotated with strawberry.django.type")
        if not ismethod(getattr(self, 'get_mutate_result', None)):
            raise ValueError("You should implement get_mutate_result method")
        self.return_type = return_type
        self.with_pk = with_pk
        self.input_type = input_type
        super().__init__(
            python_name=None,
            graphql_name=None,
            type_annotation=StrawberryAnnotation(return_type),
            **kwargs,
        )

    @property
    def arguments(self) -> list[StrawberryArgument]:
        arguments = []
        if self.with_pk:
            arguments.append(StrawberryArgument(
                python_name='pk',
                graphql_name='pk',
                type_annotation=StrawberryAnnotation(ID),
            ))
        if self.input_type:
            arguments.append(StrawberryArgument(
                python_name='data',
                graphql_name='data',
                type_annotation=StrawberryAnnotation(self.input_type),
            ))
        return arguments + super().arguments

    @arguments.setter
    def arguments(self, value: list[StrawberryArgument]) -> None:
        super().arguments.fset(self, value)  # type: ignore

    @property
    def is_basic_field(self) -> bool:
        return False

    def get_queryset(self, queryset: QuerySet, info: Info, **kwargs) -> QuerySet:
        return queryset

    def get_obj(self, queryset: QuerySet, info: Info, pk: int) -> T_Model:
        return queryset.get(pk=pk)

    def get_data_as_dict(self, data: Any) -> DataDict:
        return asdict(data)

    @django_resolver
    def get_result(self, source, info: Info | None, args, kwargs: Kwargs) -> T_Model:
        assert info
        definition = get_django_definition(self.return_type)
        model: type[T_Model] | None = definition.model if definition else None
        obj: T_Model | None = None
        data: Any | None = None
        if self.with_pk and 'pk' in kwargs and model:
            qs = self.get_queryset(model._default_manager.all(), info, **kwargs)
            obj = self.get_obj(qs, info, kwargs.pop('pk'))
        if self.input_type and 'data' in kwargs:
            data = kwargs.pop('data')
        assert len(kwargs) == 0
        return self.get_mutate_result(source, info, obj, data)

    def get_mutate_result(self, source, info: Info, obj: T_Model | None, data: Any | None) -> T_Model:
        raise NotImplementedError


class CreateMutation(BaseMutation[T_Model]):
    def __init__(self, return_type: type, input_type: type | None, /, **kwargs) -> None:
        super().__init__(return_type, input_type, with_pk=False, **kwargs)

    def get_mutate_result(self, source, info: Info, obj: T_Model | None, data: Any | None) -> T_Model:
        assert obj is None
        if self.input_type:
            assert data
        else:
            data = UNSET
        with transaction.atomic():
            return self.mutate(source, info, data)

    def mutate(self, source, info: Info, data: Any) -> T_Model:
        raise NotImplementedError


class UpdateMutation(BaseMutation[T_Model]):
    def __init__(self, return_type: type, input_type: type | None, /, **kwargs) -> None:
        super().__init__(return_type, input_type, with_pk=True, **kwargs)

    def get_mutate_result(self, source, info: Info, obj: T_Model | None, data: Any | None) -> T_Model:
        assert obj
        if self.input_type:
            assert data
        else:
            data = UNSET
        with transaction.atomic():
            return self.mutate(source, info, obj, data)

    def mutate(self, source, info: Info, obj: T_Model, data: Any) -> T_Model:
        raise NotImplementedError


class DeleteMutation(BaseMutation[T_Model]):
    def __init__(self, return_type: type, /, **kwargs) -> None:
        super().__init__(return_type, None, with_pk=True, **kwargs)

    def get_mutate_result(self, source, info: Info, obj: T_Model | None, data: Any | None) -> T_Model:
        assert obj
        assert data is None
        # ensure id is still available after object deletion
        id = getattr(obj, 'id', None)
        with transaction.atomic():
            model = self.mutate(source, info, obj)
            setattr(model, 'id', id)
            return model

    def mutate(self, source, info: Info, obj: T_Model) -> T_Model:
        raise NotImplementedError


def Mutation(resolver=None, **kwargs) -> Any:
    """
    Creates a mutation field, ready for Mutation.
    The field is already type annotated.
    Any key word arguments will be passed to strawberry mutation.

    Use it like:
    >>> def your_mutation(info, pk: int, data: dict) -> YourSchemaDef:
    >>>    ...
    >>> update_object = Mutation(your_mutation, description=...)

    Or simply:
    >>> @Mutation(description=...)
    >>> def your_mutation(info, pk: int, data: dict) -> YourSchemaDef:
    >>>    ...
    """
    dec = strawberry_mutation(**kwargs)

    def decorator_wrapper(func):
        type_hints = get_type_hints(func)
        f = dec(func)
        setattr(f, 'type_annotation', StrawberryAnnotation(type_hints['return']))
        return f
    return decorator_wrapper(resolver) if resolver else decorator_wrapper  # type: ignore


__all__ = [
    'BaseMutation',
    'CreateMutation',
    'UpdateMutation',
    'DeleteMutation',
    'Mutation',
]
