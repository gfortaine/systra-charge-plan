from ..models import User as ModelUser
from ..types import (
    HttpRequest,
    User,
)


class GraphQlService:
    @classmethod
    def get_real_user(cls, request: HttpRequest | User) -> ModelUser:
        any_user = request.user if isinstance(request, HttpRequest) else request
        if isinstance(any_user, ModelUser):
            return any_user
        else:
            raise ValueError(f"user '{any_user}' should be a real User")
