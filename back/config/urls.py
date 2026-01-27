"""Global URL Configuration"""
from typing import cast

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import (
    URLResolver,
    include,
    path,
    re_path,
)

from .settings import WITH_DEBUG_TOOLBAR

urlpatterns = [
    path('admin/', admin.site.urls),
]
if settings.OIDC_RP_CLIENT_ID:
    urlpatterns.append(path('oidc/', include('oauth2_authcodeflow.urls')))
if settings.DEBUG:
    urlpatterns += cast(list[URLResolver], static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
    urlpatterns += cast(list[URLResolver], static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
    # Allow favicon.ico to be served
    urlpatterns += cast(list[URLResolver], static('/favicon.ico', document_root=settings.BASE_DIR / 'favicon.ico'))
elif settings.FORCE_SERVE_STATIC:
    from django.views.static import serve
    urlpatterns += cast(list[URLResolver], [
        re_path(rf"^{settings.STATIC_URL[1:-1]}/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
        re_path(rf"^{settings.MEDIA_URL[1:-1]}/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
        re_path(r"^(?P<path>favicon.ico)$", serve, {"document_root": settings.BASE_DIR}),
    ])
if WITH_DEBUG_TOOLBAR:
    urlpatterns.append(path("__debug__/", include('debug_toolbar.urls')))
urlpatterns.extend([
    re_path('^', include('myapp.urls')),
])
