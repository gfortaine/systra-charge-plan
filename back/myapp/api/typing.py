from typing import Any

from strawberry.django.context import StrawberryDjangoContext
from strawberry.types import Info as GenericInfo

type Info = GenericInfo[StrawberryDjangoContext, Any]
