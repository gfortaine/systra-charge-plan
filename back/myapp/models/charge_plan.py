from django.core.validators import MinValueValidator
from django.db import models


class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    tjm = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        ordering = ('last_name', 'first_name')

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __str__(self) -> str:
        return self.full_name


class Project(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ('name',)

    def __str__(self) -> str:
        return self.name


class ChargePlanLine(models.Model):
    person = models.ForeignKey(Person, on_delete=models.PROTECT, related_name='charge_plan_lines')
    project = models.ForeignKey(Project, on_delete=models.PROTECT, related_name='charge_plan_lines')
    planned_hours = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        ordering = ('person__last_name', 'person__first_name', 'project__name', 'id')

    def __str__(self) -> str:
        return f"{self.person} - {self.project}: {self.planned_hours}h"
