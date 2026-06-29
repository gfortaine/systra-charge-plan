from decimal import Decimal

import pytest

from myapp.service.charge_plan import (
    HOURS_PER_DAY,
    calculate_amount,
)


def test_calculate_amount_uses_eight_hour_day():
    assert HOURS_PER_DAY == Decimal("8")
    assert calculate_amount(Decimal("800.00"), Decimal("8")) == Decimal("800.00")
    assert calculate_amount(Decimal("800.00"), Decimal("4")) == Decimal("400.00")


def test_calculate_amount_accepts_decimal_hours():
    assert calculate_amount(Decimal("640.00"), Decimal("1.50")) == Decimal("120.00")


def test_calculate_amount_returns_zero_for_zero_hours():
    assert calculate_amount(Decimal("720.00"), Decimal("0")) == Decimal("0.00")


def test_calculate_amount_rejects_negative_hours():
    with pytest.raises(ValueError, match="planned_hours"):
        calculate_amount(Decimal("720.00"), Decimal("-1"))


def test_calculate_amount_rejects_negative_tjm():
    with pytest.raises(ValueError, match="tjm"):
        calculate_amount(Decimal("-720.00"), Decimal("1"))
