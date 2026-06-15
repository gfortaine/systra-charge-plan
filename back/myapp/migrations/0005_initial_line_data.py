from json import load

from django.conf import settings
from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps


def add_new_line(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    Line = apps.get_model('myapp', 'Line')
    geo_line_path = settings.BASE_DIR / 'line.json'
    geo_line = load(geo_line_path.open())
    points = geo_line['features'][0]['geometry']['coordinates']
    Line.objects.create(points=points)


def delete_lines(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    Line = apps.get_model('myapp', 'Line')
    Line.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0004_line"),
    ]
    operations = [
        migrations.RunPython(add_new_line, delete_lines),
    ]
