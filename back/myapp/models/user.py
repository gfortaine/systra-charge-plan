from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    def get_full_name(self) -> str:
        parts = []
        if self.first_name:
            parts.append(self.first_name)
        if self.last_name:
            parts.append(self.last_name)
        return ' '.join(parts) if parts else ''

    @property
    def full_name(self) -> str:
        return self.get_full_name()

    @property
    def display_name(self) -> str:
        if self.is_superuser:
            return self.get_full_name() or self.get_username()
        else:
            return self.get_full_name() or self.email or self.get_username()

    def __str__(self) -> str:
        return self.display_name
