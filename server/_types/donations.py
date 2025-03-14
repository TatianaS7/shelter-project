from enum import Enum
from marshmallow import Schema, fields


class DonationType(Enum):
    MONETARY = 'Monetary'
    PHYSICAL = 'Physical'      

class DonationStatus(Enum):
    PENDING = 'Pending'
    ACCEPTED = 'Accepted'
    REJECTED = 'Rejected'
    CANCELLED = 'Cancelled'


class Donation(Schema):
    id = fields.Int(dump_only=True)
    status = fields.Enum(DonationStatus)
    user_id = fields.Int()
    shelter_id = fields.Int()
    donation_type = fields.Enum(DonationType)
    donation_amount = fields.Float()
    donated_items = fields.List(fields.Str(), allow_none=True)
    note = fields.Str(allow_none=True)
    created_at = fields.DateTime()