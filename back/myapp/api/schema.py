import strawberry
from strawberry.extensions import ParserCache
from strawberry.schema.config import StrawberryConfig
from strawberry.types.scalar import identity
from strawberry_django.optimizer import DjangoOptimizerExtension

from .charge_plan.mutations import save_charge_plan
from .charge_plan.queries import (
    all_charge_plan_lines,
    all_people,
    all_projects,
)
from .typing import (
    Latitude,
    Longitude,
)
from ..utils.version import version


@strawberry.type
class Query:
    @strawberry.field
    def version(self) -> str:
        return version
    all_people = all_people
    all_projects = all_projects
    all_charge_plan_lines = all_charge_plan_lines


@strawberry.type
class Mutation:
    save_charge_plan = save_charge_plan


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    config=StrawberryConfig(
        scalar_map={
            Latitude: strawberry.scalar(
                name="Latitude",
                description="in Geodesic WGS-84 projection",
                serialize=identity,
                parse_value=identity,
            ),
            Longitude: strawberry.scalar(
                name="Longitude",
                description="in Geodesic WGS-84 projection",
                serialize=identity,
                parse_value=identity,
            ),
        },
    ),
    extensions=[
        DjangoOptimizerExtension,
        lambda: ParserCache(maxsize=100),
    ],
)
