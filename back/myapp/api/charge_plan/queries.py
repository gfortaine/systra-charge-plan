from .types import (
    ChargePlanLine,
    Person,
    Project,
)
from ..queries import DjangoQuery

all_people = DjangoQuery(list[Person])
all_projects = DjangoQuery(list[Project])
all_charge_plan_lines = DjangoQuery(list[ChargePlanLine])
