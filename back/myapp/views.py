from django.conf import settings
from django.http import (
    HttpRequest,
    HttpResponse,
    JsonResponse,
)
from django.shortcuts import render

from .utils.version import version


def get_version(request: HttpRequest) -> JsonResponse:
    return JsonResponse({
        'version': version,
    })


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "index.html", {
        'DEV_MODE': settings.DJVITE['DEV_MODE'],
    })
