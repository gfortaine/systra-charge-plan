from typing import cast

from django.core.exceptions import ValidationError
from django.db import transaction

from .types import (
    ChargePlanLine,
    ChargePlanLineInput,
)
from ..mutations import Mutation
from ..typing import Info
from ... import models


def _parse_pk(raw_pk: object, field_name: str) -> int:
    try:
        return int(str(raw_pk))
    except ValueError as exc:
        raise ValidationError(f"{field_name} must be a valid id") from exc


@Mutation
def save_charge_plan(info: Info, lines: list[ChargePlanLineInput]) -> list[ChargePlanLine]:
    with transaction.atomic():
        models.ChargePlanLine.objects.all().delete()
        created_lines = []
        for line in lines:
            person = models.Person.objects.get(pk=_parse_pk(line.person_id, 'person_id'))
            project = models.Project.objects.get(pk=_parse_pk(line.project_id, 'project_id'))
            charge_plan_line = models.ChargePlanLine(
                person=person,
                project=project,
                planned_hours=line.planned_hours,
            )
            charge_plan_line.full_clean()
            charge_plan_line.save()
            created_lines.append(charge_plan_line)
        return cast(list[ChargePlanLine], created_lines)
