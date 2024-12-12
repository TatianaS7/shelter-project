from enum import Enum
from marshmallow import Schema, fields


class ResourceNeed(Enum):
    BLANKETS = 'Blankets'
    FOOD = 'Food'
    CLOTHING = 'Clothing'
    HYGIENE = 'Hygiene' 
    WATER = 'Water'
    MEDICINE = 'Medicine'
    OTHER = 'Other'

class UnitType(Enum):
    BAG = 'Bag'
    PACKAGE = 'Package'
    BOX = 'Box'
    BOTTLE = 'Bottle'
    CAN = 'Can'
    ITEM = 'Item'
    MEAL = 'Meal'


class Resource(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    quantity = fields.Int()
    unit = fields.Enum(UnitType)
    resource_type = fields.Enum(ResourceNeed)
    shelter_id = fields.Int()
    priority = fields.Int()
    created_at = fields.DateTime()
