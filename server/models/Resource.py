# Model for Resource
from connection import db
from _types import ResourceNeed, UnitType
from datetime import datetime

class Resource(db.Model):
    __tablename__ = 'resource'

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.Enum(UnitType), nullable=False)
    resource_type = db.Column(db.Enum(ResourceNeed), nullable=False)
    shelter_id = db.Column(db.Integer, db.ForeignKey('shelter.id'), nullable=False)
    priority = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, quantity, unit, resource_type, shelter_id, priority):
        self.quantity = quantity
        self.unit = unit
        self.resource_type = resource_type
        self.shelter_id = shelter_id
        self.priority = priority

    def serialize(self):
        return {
            'id': self.id,
            'quantity': self.quantity,
            'unit': self.unit.value,
            'resource_type': self.resource_type.value,
            'shelter_id': self.shelter_id,
            'priority': self.priority,
            'created_at': self.created_at.isoformat()
        }