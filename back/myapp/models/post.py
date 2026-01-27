from pathlib import Path

from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete
from django.utils.timezone import now


def pre_delete_handler(sender: type['Post'], instance: 'Post', **kwargs) -> None:
    post = instance
    if post.image and (image_path := settings.MEDIA_ROOT / Path(post.image.name)).exists():
        image_path.unlink()


class Post(models.Model):
    title = models.CharField(max_length=100, unique=True)
    # just for the example to also run on sqlite, you should use a TextField for postgresql
    text = models.CharField(max_length=1000)
    image = models.ImageField(null=True, blank=True, max_length=1023)
    pubdate = models.DateTimeField(default=now)
    author = models.ForeignKey('User', on_delete=models.CASCADE, related_name='posts')
    categories = models.ManyToManyField('Category', related_name='posts')  # type: ignore[var-annotated]

    _signals = {
        pre_delete: pre_delete_handler,
    }

    def __str__(self) -> str:
        return f"{self.title}"
