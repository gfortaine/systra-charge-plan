from django.db.models import (
    CharField,
    Field,
    Lookup,
)


@Field.register_lookup
class NotEqual(Lookup):
    lookup_name = 'ne'

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        params = lhs_params + rhs_params
        return f'{lhs} <> {rhs}', params


@CharField.register_lookup
class IsEmpty(Lookup):
    lookup_name = 'isempty'
    prepare_rhs = False

    def as_sql(self, compiler, connection):
        if not isinstance(self.rhs, bool):
            raise ValueError(
                f'The QuerySet value for an {self.lookup_name} lookup must be True or False.'
            )
        lhs, lhs_params = self.process_lhs(compiler, connection)
        if self.rhs:
            return f"{lhs} IS NULL OR {lhs} = ''", lhs_params
        else:
            return f"{lhs} IS NOT NULL AND {lhs} <> ''", lhs_params
