from functools import partial
from types import GenericAlias
from typing import (
    Any,
    Generic,
    Optional,
    TypeVar,
    cast,
)

import strawberry
import strawberry_django
from django.db.models import (
    F,
    Model,
    OrderBy,
    Q,
    QuerySet,
)
from django.db.models.expressions import BaseExpression
from strawberry.annotation import StrawberryAnnotation
from strawberry.types.base import (
    WithStrawberryObjectDefinition,
    has_object_definition,
)
from strawberry.types.field import StrawberryField
from strawberry_django import (
    Ordering,
    filter_field,
    filter_type,
    order_field,
    order_type,
    process_filters,
)
# import StrFilterLookup directly from strawberry_django when this is merged and release
# https://github.com/strawberry-graphql/strawberry-django/pull/851
from strawberry_django.fields.filter_types import StrFilterLookup
from strawberry_django.pagination import OffsetPaginationInput
from strawberry_django.utils.typing import has_django_definition

from .typing import Info

_T = TypeVar('_T')
Model_T = TypeVar('Model_T', bound=Model, covariant=True)
Filter_T = TypeVar('Filter_T')
FilterResult = tuple[QuerySet, Q] | Q
OrderListElement = F | OrderBy | str
OrderList = list[OrderListElement]
OrderResult = tuple[QuerySet, OrderList] | OrderList


class Query(type):
    """
    Creates a field, ready for Query.
    The field is already type annotated.
    Any key word arguments will be passed to strawberry field.

    Use it like:
    >>> @strawberry.type
    >>> class YourSchemaDef:
    >>>    ...
    >>> all_objects = Query(list[YourSchemaDef], resolver=..., description=...)
    """
    def __new__(metacls, graphql_type: type | None = None, /, **kwargs) -> Any:
        field = strawberry.field(**kwargs)
        if graphql_type is not None:
            metacls.annotate_field(field, graphql_type)
        return field

    @classmethod
    def annotate_field(metacls, field: StrawberryField, graphql_type: type) -> None:
        """
        Allow to use the field in a query without specifying the typehint twice.
        """
        setattr(field, 'type_annotation', StrawberryAnnotation(graphql_type))


class DjangoQuery(Query):
    """
    Creates a django field, ready for Query.
    The field is already type annotated.
    Any key word arguments will be passed to strawberry django field.
    Any `list` type will have `pagination=True` unless defined otherwise.

    Use it like:
    >>> @strawberry.django.type(models.YourModel, filters=YourModelFilter, ordering=YourModelOrder)
    >>> class YourSchemaDef:
    >>>    ...
    >>> one_model = DjangoQuery(YourSchemaDef)
    >>> all_models = DjangoQuery(list[YourSchemaDef])
    """
    def __new__(metacls, graphql_type: type | None = None, /, **kwargs) -> Any:
        if graphql_type is not None:
            raw_type = base_type = graphql_type
            if isinstance(graphql_type, GenericAlias):
                raw_type = cast(type, graphql_type.__origin__)
            if issubclass(raw_type, list):
                if hasattr(graphql_type, '__args__'):
                    base_type = graphql_type.__args__[0]
                if 'pagination' not in kwargs:
                    kwargs['pagination'] = True
            if not has_django_definition(base_type):
                raise ValueError(f"{base_type} is not annotated with strawberry.django.type")
        django_field = strawberry_django.field(**kwargs)
        if graphql_type is not None:
            metacls.annotate_field(django_field, graphql_type)
        return django_field


def django_field(resolver=None, *, graphql_type: type | None = None, **kwargs) -> Any:
    """Decorator for a resolver that returns a QuerySet, can take filters, ordering and pagination objects."""
    f = DjangoQuery(graphql_type, **kwargs)
    return f(resolver) if resolver else f


@strawberry.input
class FilterInLookup(Generic[_T]):
    """
    Use it like:
    >>> @filter_type(models.OneModel, lookups=True)
    >>>   id: strawberry.auto
    >>>   status: FilterInLookup[Annotated['StatusChoices', strawberry.lazy('.types')]] | None = strawberry.UNSET
    """
    exact: _T | None = strawberry.UNSET
    in_list: list[_T] | None = strawberry.UNSET


def apply_filter(
    queryset: QuerySet,
    value: Any,
    prefix: str,
    field_names: str | list[str] | tuple[str, ...],
    info: Info | None = None,
) -> tuple[QuerySet, Q]:
    is_strawberry_object = has_object_definition(value)
    if is_strawberry_object and info is None:
        raise ValueError("info is required if value is an object definition or filter lookup")
    if isinstance(field_names, str):
        field_names = (field_names,)
    if is_strawberry_object:
        process_filters_partial = partial(process_filters, filters=value, info=info)
        q = Q()
        for field_name in field_names:
            queryset, sub_q = process_filters_partial(
                queryset=queryset,
                prefix=f'{prefix}{field_name}__',
            )
            q |= sub_q
    else:
        q = Q()
        for field_name in field_names:
            q |= Q(**{f'{prefix}{field_name}': value})
    return queryset, q


def ordering_resolve_f_value(ordering: Ordering, f_value: F | BaseExpression) -> OrderBy:
    nulls_first = True if 'NULLS_FIRST' in ordering.name else None
    nulls_last = True if 'NULLS_LAST' in ordering.name else None
    if 'ASC' in ordering.name:
        return f_value.asc(nulls_first=nulls_first, nulls_last=nulls_last)
    return f_value.desc(nulls_first=nulls_first, nulls_last=nulls_last)


@strawberry.type
class Count:
    total_count: int


class CountQuery(Query):
    """
    Creates a field, ready for Query.
    The field is a counter and returns a `Count` type.
    Use it like:
    >>> count_your_models = CountQuery(models.YourModel.objects, YourModelFilter)
    """
    def __new__(metacls, queryset: QuerySet, filter_cls: type[Filter_T] | None, **kwargs) -> Any:
        kwargs.pop('resolver', None)

        def count_resolver(info: Info, filters: Filter_T | None = strawberry.UNSET) -> Count:
            processed_queryset, q = process_filters(
                cast(WithStrawberryObjectDefinition, filters),
                queryset.all(),
                info,
            ) if filters else (queryset.all(), None)
            filtered_queryset = processed_queryset.filter(q) if q else processed_queryset
            return Count(total_count=filtered_queryset.count())
        # hack resolver signature to use real type filter_cls instead of generic type Filter_T
        count_resolver.__annotations__['filters'] = Optional[filter_cls]
        return super().__new__(metacls, Count, resolver=count_resolver, **kwargs)


def count_field(resolver=None, *, filter_cls: type[Filter_T] | None = strawberry.UNSET, **kwargs) -> Any:
    """Decorator for a resolver that returns a QuerySet and can take filters object. It then returns a Count object."""
    def decorator(resolver) -> Any:
        def count_resolver(self, info: Info, filters: Filter_T | None = strawberry.UNSET) -> Count:
            queryset = resolver(self, filters=filters)
            processed_queryset, q = process_filters(
                cast(WithStrawberryObjectDefinition, filters),
                queryset,
                info,
            ) if filters else (queryset, None)
            filtered_queryset = processed_queryset.filter(q) if q else processed_queryset
            return Count(total_count=filtered_queryset.count())
        # hack resolver signature to use real type filter_cls instead of generic type Filter_T
        if filter_cls is strawberry.UNSET:
            resolved_filter_cls = resolver.__annotations__.get('filters')
        else:
            resolved_filter_cls = filter_cls
        count_resolver.__annotations__['filters'] = Optional[resolved_filter_cls]
        return Query(Count, resolver=count_resolver, **kwargs)
    return decorator(resolver) if resolver else decorator


__all__ = [
    'Count',
    'CountQuery',
    'DjangoQuery',
    'FilterInLookup',
    'FilterResult',
    'OffsetPaginationInput',
    'OrderList',
    'OrderListElement',
    'OrderResult',
    'Query',
    'StrFilterLookup',
    'WithStrawberryObjectDefinition',
    'apply_filter',
    'count_field',
    'django_field',
    'filter_field',
    'filter_type',
    'order_field',
    'order_type',
    'ordering_resolve_f_value',
    'process_filters',
]
