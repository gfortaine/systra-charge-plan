from django.db import models


class Line(models.Model):
    points = models.JSONField()

    def __str__(self) -> str:
        return f"Line with {len(self.points)} point{'s' if len(self.points) > 1 else ''}"
