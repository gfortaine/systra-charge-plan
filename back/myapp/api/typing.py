from typing import Any

import strawberry
from django.http import HttpRequest
from strawberry.django.context import StrawberryDjangoContext
from strawberry.types import Info as GenericInfo

from ..typing import (
    Latitude,
    Longitude,
)

type Info = GenericInfo[StrawberryDjangoContext, Any]


@strawberry.type
class Point:
    longitude: Longitude
    latitude: Latitude


type Line = list[Point]

__all__ = [
    'HttpRequest',
    'Info',
    'Longitude',
    'Latitude',
    'Point',
    'Line',
]
