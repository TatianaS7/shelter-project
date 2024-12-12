from marshmallow import Schema, fields
from enum import Enum


class UserType(Enum):
    TEAM_MEMBER = 'Team Member'
    DONOR = 'Donor'

class UserRole(Enum):
    ADMIN = 'Admin'
    VIEWER = 'Viewer'

class UserStatus(Enum):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'


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
