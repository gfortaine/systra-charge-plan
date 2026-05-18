from functools import partial
from typing import (
    Any,
    Callable,
    ClassVar,
    Iterable,
)

from strawberry.extensions.field_extension import SyncExtensionResolver
from strawberry_django.fields.types import OperationInfo
from strawberry_django.permissions import IsStaff  # noqa: F401
from strawberry_django.permissions import IsSuperuser  # noqa: F401
from strawberry_django.permissions import (
    DjangoNoPermission,
    DjangoPermissionExtension,
)

from .typing import Info
from .. import models
from ..service.graphql import GraphQlService
from ..types import User


def getattrvalue(obj_or_dict: object | dict, key: str) -> Any | None:
    return obj_or_dict.get(key) if isinstance(obj_or_dict, dict) else getattr(obj_or_dict, key, None)


class PermExtension(DjangoPermissionExtension):
    """Same as DjangoPermissionExtension but:
        - raises DjangoNoPermission even for optional or list
        - keyword arguments are passed to resolve_for_user, simply renamed resolve_perms
    """
    def __init__(self, *, message: str | None = None):
        super().__init__(message=message, use_directives=True, fail_silently=False)

    def resolve(self, next_: SyncExtensionResolver, source: Any, info: Info, **kwargs) -> Any:
        user = GraphQlService.get_real_user(info.context.request)
        try:
            retval = self.resolve_perms(
                partial(next_, source, info, **kwargs),
                user,
                info=info,
                source=source,
                **kwargs,
            )
        except DjangoNoPermission as e:
            retval = self.handle_no_permission(e, info=info)
        return retval

    def resolve_perms(self, resolver: Callable, user: User, *, info: Info, source: Any, **kwargs) -> Any:
        raise NotImplementedError

    def getattrvalue(self, obj_or_dict: object | dict, key: str) -> Any | None:
        return getattrvalue(obj_or_dict, key)


class IsSuperuserOrStaff(PermExtension):
    """Mark a field as only resolvable by superuser or staff users."""
    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "User is not a superuser nor a staff."
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved by superuser of staff users."

    def resolve_perms(self, resolver: Callable, user: User, *, info: Info, source: Any, **kwargs) -> Any:
        if not (user.is_authenticated and (user.is_superuser or user.is_staff)):
            raise DjangoNoPermission
        return resolver()


class OrConditions(PermExtension):
    """Mark a field as resolvable by any of the sub conditions."""
    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "None of the permission conditions are met."
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved when at least one condition is met."
    CONDITIONS: ClassVar[list[PermExtension]] = []

    def __init__(self, *, conditions: list[PermExtension] | None = None, message: str | None = None):
        super().__init__(message=message)
        self.conditions = conditions if conditions else self.CONDITIONS

    def resolve_perms(self, resolver: Callable, user: User, *, info: Info, source: Any, **kwargs) -> Any:
        dummy_resolver = lambda: None  # noqa: E731
        for cond in self.conditions:
            try:
                cond.resolve_perms(dummy_resolver, user, info=info, source=source, **kwargs)
                break
            except DjangoNoPermission:
                pass
        else:
            raise DjangoNoPermission(self.message)
        return resolver()


class AndConditions(PermExtension):
    """Mark a field as resolvable by all of the sub conditions."""
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved when all conditions are met."
    CONDITIONS: ClassVar[list[PermExtension]] = []

    def __init__(self, *, conditions: list[PermExtension] | None = None, message: str | None = None):
        super().__init__(message=message)
        self.conditions = conditions if conditions else self.CONDITIONS

    def resolve_perms(self, resolver: Callable, user: User, *, info: Info, source: Any, **kwargs) -> Any:
        dummy_resolver = lambda: None  # noqa: E731
        for cond in self.conditions:
            cond.resolve_perms(dummy_resolver, user, info=info, source=source, **kwargs)
        return resolver()


type CachePermType = dict[tuple[Any, Any], bool]


class HasPermissionOnObj[T](PermExtension):
    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "You don't have permission to access this object."
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved when enough permission on an object."

    def __init__(self, *, message: str | None = None, with_superuser: bool = True, with_staff: bool = False, with_anonymous: bool = True):
        super().__init__(message=message)
        self.with_superuser = with_superuser
        self.with_staff = with_staff
        self.with_anonymous = with_anonymous

    def resolve_perms(self, resolver: Callable, user: User, *, info: Info, source: Any, **kwargs) -> Any:
        if self.with_superuser and user.is_active and user.is_superuser:
            return resolver()
        if self.with_staff and user.is_active and user.is_staff:
            return resolver()
        if self.with_anonymous and user.is_anonymous:
            raise DjangoNoPermission
        retval = resolver()
        if retval is None:
            return None
        return self._resolve_obj_perms(info, user, retval)

    def get_cache(self, info: Info, user: User) -> CachePermType:
        cache_key = f"_{self.__class__.__name__}_cache"
        if (cache := getattr(user, cache_key, None)) is not None:
            return cache
        else:
            cache = {}
            setattr(user, cache_key, cache)
            return cache

    def _resolve_obj_perms(self, info: Info, user: User, obj: Any) -> Any:
        if isinstance(obj, Iterable):
            return self._has_permission_on_obj_iterable(info, user, obj)
        else:
            has_perm = self.get_cache(info, user).get((self, obj))
            if has_perm is None:
                has_perm = self._has_permission_on_obj(info, user, obj)
            if not has_perm:
                raise DjangoNoPermission
            else:
                return obj

    def _has_permission_on_obj_iterable(self, info: Info, user: User, obj_list: Iterable[T | OperationInfo]) -> list[Any]:
        cache = self.get_cache(info, user)
        allowed_objs = [obj for obj in obj_list if self._check_obj(info, user, cache, obj)]
        return allowed_objs

    def _has_permission_on_obj(self, info: Info, user: User, obj: T) -> bool:
        cache = self.get_cache(info, user)
        return self._check_obj(info, user, cache, obj)

    def _check_obj(self, info: Info, user: User, cache: CachePermType, obj: T | OperationInfo) -> bool:
        key = (self, obj)
        if key in cache:  # Maybe the result ended up in the cache in the meantime
            return cache[key]
        if isinstance(obj, OperationInfo):
            has_perm = True
        else:
            real_user = GraphQlService.get_real_user(user)
            has_perm = self.check_perm_on_obj(info, real_user, obj)
        cache[key] = has_perm
        return has_perm

    def check_perm_on_obj(self, info: Info, user: models.User, obj: T) -> bool:
        raise NotImplementedError
