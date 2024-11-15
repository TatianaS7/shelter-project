from marshmallow import Schema, fields

from _types import DonationType, UserRole, UserType, ResourceNeed


class Shelter(Schema):
    id = fields.Int(dump_only=True)
    shelter_name = fields.Str()
    address = fields.Str()
    phone = fields.Str()
    primary_email = fields.Str()
    capacity = fields.Int()
    current_occupancy = fields.Int()
    current_funding = fields.Float()
    funding_needs = fields.Float()
    resource_needs = fields.Dict(keys=fields.Str(), values=fields.Int(), default={})
    donations = fields.Dict(fields.Nested('Donation'))
    staff = fields.List(fields.Nested('User'))


class User(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str()
    last_name = fields.Str()
    email = fields.Str()
    user_role = fields.Enum(UserRole, allow_none=True)
    user_type = fields.Enum(UserType)
    password = fields.Str()
    shelter_id = fields.Int()
    donations = fields.List(fields.Nested('Donation'))


class Donation(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int()
    shelter_id = fields.Int()
    donation_type = fields.Enum(DonationType)
    donation_amount = fields.Float()
    donated_items = fields.List(fields.Str(), allow_none=True)
    note = fields.Str(allow_none=True)
