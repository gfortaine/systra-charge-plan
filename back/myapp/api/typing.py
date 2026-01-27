from typing import (
    Any,
    TypeAlias,
)

from strawberry.django.context import StrawberryDjangoContext
from strawberry.types import Info as GenericInfo

Info: TypeAlias = GenericInfo[StrawberryDjangoContext, Any]
