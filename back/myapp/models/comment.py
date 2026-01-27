from django.db import models
from django.utils.timezone import now


class Comment(models.Model):
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='comments')
    # just for the example to also run on sqlite, you should use a TextField for postgresql
    text = models.CharField(max_length=1000)
    date = models.DateTimeField(default=now)
    author = models.ForeignKey('User', on_delete=models.CASCADE, related_name='comments')

    def __str__(self) -> str:
        return f"{self.post} - {self.author}"
