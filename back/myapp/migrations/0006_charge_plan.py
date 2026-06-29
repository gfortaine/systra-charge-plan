from decimal import Decimal

import django.core.validators
import django.db.models.deletion
from django.db import (
    migrations,
    models,
)
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps


PEOPLE = [
    ('Alice', 'Martin', Decimal('720.00')),
    ('Bruno', 'Durand', Decimal('640.00')),
    ('Claire', 'Bernard', Decimal('800.00')),
]

PROJECTS = [
    'Grand Paris Express',
    'Metro Lyon Modernisation',
    'Tramway Bordeaux',
]


def seed_charge_plan_references(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    Person = apps.get_model('myapp', 'Person')
    Project = apps.get_model('myapp', 'Project')
    for first_name, last_name, tjm in PEOPLE:
        Person.objects.get_or_create(first_name=first_name, last_name=last_name, defaults={'tjm': tjm})
    for name in PROJECTS:
        Project.objects.get_or_create(name=name)


def delete_charge_plan_references(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    ChargePlanLine = apps.get_model('myapp', 'ChargePlanLine')
    Person = apps.get_model('myapp', 'Person')
    Project = apps.get_model('myapp', 'Project')
    ChargePlanLine.objects.all().delete()
    Person.objects.filter(first_name__in=[person[0] for person in PEOPLE], last_name__in=[person[1] for person in PEOPLE]).delete()
    Project.objects.filter(name__in=PROJECTS).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('myapp', '0005_initial_line_data'),
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('tjm', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
            ],
            options={
                'ordering': ('last_name', 'first_name'),
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='ChargePlanLine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('planned_hours', models.DecimalField(decimal_places=2, max_digits=7, validators=[django.core.validators.MinValueValidator(0)])),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='charge_plan_lines', to='myapp.person')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='charge_plan_lines', to='myapp.project')),
            ],
            options={
                'ordering': ('person__last_name', 'person__first_name', 'project__name', 'id'),
            },
        ),
        migrations.RunPython(seed_charge_plan_references, delete_charge_plan_references),
    ]
