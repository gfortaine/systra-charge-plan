from tomllib import loads

from django.conf import settings

try:
    version = loads((settings.BASE_DIR / '..' / 'pyproject.toml').read_text())['project']['version']
except Exception:
    version = 'unknown'
