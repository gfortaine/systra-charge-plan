from decimal import Decimal

import strawberry
import strawberry_django

from ... import models
from ...service.charge_plan import calculate_amount


@strawberry_django.type(models.Person, description='Charge-plan person reference')
class Person:
    id: strawberry.auto

    @strawberry.field
    @staticmethod
    def full_name(self: models.Person) -> str:
        return self.full_name


@strawberry_django.type(models.Project)
class Project:
    id: strawberry.auto
    name: strawberry.auto


@strawberry_django.type(models.ChargePlanLine)
class ChargePlanLine:
    id: strawberry.auto
    person: Person
    project: Project
    planned_hours: strawberry.auto

    @strawberry.field
    @staticmethod
    def amount(self: models.ChargePlanLine) -> Decimal:
        return calculate_amount(self.person.tjm, self.planned_hours)


@strawberry.input
class ChargePlanLineInput:
    person_id: strawberry.ID
    project_id: strawberry.ID
    planned_hours: Decimal
