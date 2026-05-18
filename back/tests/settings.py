from os import getenv
from pathlib import Path
from typing import Any

DATABASES: dict[str, dict[str, Any]] = dict()
from config.settings import *  # noqa: E402,F401,F403

TEST_DIR = Path(__file__).resolve(strict=True).parent
if getenv('DJANGO_DB_TYPE', 'postgresql') == 'sqlite':
    DATABASES['default']['NAME'] = TEST_DIR / 'db' / 'test.sqlite'
else:
    DATABASES['default']['NAME'] = getenv('CI_PROJECT_NAME', 'myapp')
    DATABASES['default']['USER'] = getenv('CI_PROJECT_NAME', 'myapp')
    DATABASES['default']['PASSWORD'] = getenv('CI_PROJECT_NAME', 'myapp')
MEDIA_ROOT = TEST_DIR / 'media'
DJANGO_VITE_PLUGIN = {
    'DEV_MODE': True,
    'BUILD_DIR': 'build',
}
