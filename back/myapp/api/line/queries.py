from .types import Line
from ..queries import DjangoQuery

all_lines = DjangoQuery(list[Line])
