from django.apps import AppConfig as SuperAppConfig


class AppConfig(SuperAppConfig):
    name = 'myapp'
    verbose_name = 'Myapp'

    def ready(self):
        from .signals import setup_signals
        setup_signals()
