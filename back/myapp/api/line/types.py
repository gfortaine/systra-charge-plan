from typing import cast

import strawberry
import strawberry_django

from ..typing import Point
from ... import (
    models,
    typing,
)


@strawberry_django.type(models.Line)
class Line:
    @strawberry.field
    @staticmethod
    def points(self: models.Line) -> list[Point]:
        _points = cast(list[typing.Point], self.points)
        # due to typing, one cannot mix the order from pt
        # without a type check error
        points = [Point(longitude=pt[0], latitude=pt[1]) for pt in _points]
        return points
