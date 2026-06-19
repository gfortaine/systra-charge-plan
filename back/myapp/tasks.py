from crontask import cron
from django.db.models import Count
from django.tasks import task

from .models import Category


# https://docs.djangoproject.com/en/6.1/ref/tasks/#tasks
@cron("*/30 * * * *")  # every 30 minutes
@task
def purge_unused_cats() -> int:
    num, _ = Category.objects.annotate(nb_posts=Count('posts__id')).filter(nb_posts=0).delete()
    return num
