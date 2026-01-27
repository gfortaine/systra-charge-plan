from django.conf import settings
from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView

from .api.schema import schema
from .views import get_version, index

urlpatterns = [
    path('version', csrf_exempt(get_version), name='version'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(schema=schema, graphql_ide=settings.DEBUG))),
    path('', index, name='index'),
    re_path(r'[a-z][^.]+', index),
]
