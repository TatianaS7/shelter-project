from enum import Enum
from marshmallow import Schema, fields


class ShelterStatus(Enum):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class Shelter(Schema):
    id = fields.Int(dump_only=True)
    status = fields.Enum(ShelterStatus)
    shelter_name = fields.Str()
    address = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zip_code = fields.Str()
    phone = fields.Str()
    primary_email = fields.Str()
    capacity = fields.Int()
    current_occupancy = fields.Int()
    current_funding = fields.Float()
    funding_needs = fields.Float()
    resource_needs = fields.Dict(fields.Nested('Resource'))
    donations = fields.Dict(fields.Nested('Donation'))
    staff = fields.List(fields.Nested('User'))
