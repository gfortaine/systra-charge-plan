import pytest

from myapp import models
from myapp.api.schema import schema


@pytest.mark.django_db
def test_charge_plan_reference_queries_expose_public_fields():
    result = schema.execute_sync(
        """
        query {
          allPeople {
            id
            fullName
          }
          allProjects {
            id
            name
          }
        }
        """,
    )

    assert result.errors is None
    assert result.data is not None
    assert len(result.data["allPeople"]) == 3
    assert len(result.data["allProjects"]) == 3
    assert result.data["allPeople"][0].keys() == {"id", "fullName"}
    assert result.data["allProjects"][0].keys() == {"id", "name"}


@pytest.mark.django_db
def test_save_charge_plan_persists_lines_and_returns_backend_amount():
    person = models.Person.objects.get(first_name="Alice", last_name="Martin")
    project = models.Project.objects.get(name="Grand Paris Express")

    result = schema.execute_sync(
        """
        mutation SaveChargePlan($lines: [ChargePlanLineInput!]!) {
          saveChargePlan(lines: $lines) {
            plannedHours
            amount
            person {
              fullName
            }
            project {
              name
            }
          }
        }
        """,
        variable_values={
            "lines": [{
                "personId": str(person.id),
                "projectId": str(project.id),
                "plannedHours": "4",
            }],
        },
    )

    assert result.errors is None
    assert result.data == {
        "saveChargePlan": [{
            "plannedHours": "4",
            "amount": "360.00",
            "person": {
                "fullName": "Alice Martin",
            },
            "project": {
                "name": "Grand Paris Express",
            },
        }],
    }
    assert models.ChargePlanLine.objects.count() == 1

    reload_result = schema.execute_sync(
        """
        query {
          allChargePlanLines {
            plannedHours
            amount
            person {
              fullName
            }
            project {
              name
            }
          }
        }
        """,
    )

    assert reload_result.errors is None
    assert reload_result.data == {
        "allChargePlanLines": [{
            "plannedHours": "4.00",
            "amount": "360.00",
            "person": {
                "fullName": "Alice Martin",
            },
            "project": {
                "name": "Grand Paris Express",
            },
        }],
    }


@pytest.mark.django_db
def test_charge_plan_schema_does_not_expose_tjm():
    result = schema.execute_sync(
        """
        query {
          __type(name: "Person") {
            fields {
              name
            }
          }
        }
        """,
    )

    assert result.errors is None
    assert result.data is not None
    field_names = {field["name"] for field in result.data["__type"]["fields"]}
    assert "tjm" not in field_names
    assert field_names == {"id", "fullName"}
