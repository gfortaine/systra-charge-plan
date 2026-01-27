from importlib import import_module

from django.db.models.base import ModelBase
from django.dispatch import receiver

models_dict = import_module('.models', __package__).__dict__
model_cls_list = [m for k, m in models_dict.items() if not k.startswith('_') and isinstance(m, ModelBase)]
_signals_installed = False


def apply_signals_to_func(func, *signals) -> None:
    for dec in signals:
        func = dec(func)


def setup_signals():
    global _signals_installed
    if _signals_installed:
        return
    for model_cls in model_cls_list:
        for signal, handler in getattr(model_cls, '_signals', {}).items():
            apply_signals_to_func(handler, receiver(signal, sender=model_cls))
    _signals_installed = True


__all__ = ['setup_signals']
