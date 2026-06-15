from typing import NewType

Longitude = NewType('Longitude', float)
Latitude = NewType('Latitude', float)
type Point = tuple[Longitude, Latitude]

__all__ = [
    'Longitude',
    'Latitude',
    'Point',
]
