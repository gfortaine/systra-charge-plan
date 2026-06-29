from decimal import (
    Decimal,
    ROUND_HALF_UP,
)

HOURS_PER_DAY = Decimal("8")
MONEY_QUANT = Decimal("0.01")


def calculate_amount(tjm: Decimal, planned_hours: Decimal) -> Decimal:
    if planned_hours < 0:
        raise ValueError("planned_hours must be non-negative")
    if tjm < 0:
        raise ValueError("tjm must be non-negative")
    return (tjm * planned_hours / HOURS_PER_DAY).quantize(MONEY_QUANT, rounding=ROUND_HALF_UP)
