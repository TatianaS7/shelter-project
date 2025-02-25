# Model for Donation
from connection import db
from _types import DonationType, DonationStatus, ResourceNeed, UserRole, UserType
from datetime import datetime

class Donation(db.Model):
    __tablename__ = 'donation'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(DonationStatus), nullable=False, default=DonationStatus.PENDING)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    shelter_id = db.Column(db.Integer, db.ForeignKey('shelter.id'), nullable=False)
    donation_type = db.Column(db.Enum(DonationType), nullable=False)
    donation_amount = db.Column(db.Float, nullable=True)
    donated_items = db.Column(db.JSON, nullable=True)
    note = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, status, user_id, shelter_id, donation_type, donation_amount, donated_items, note):
        self.status = status
        self.user_id = user_id
        self.shelter_id = shelter_id
        self.donation_type = donation_type
        self.donation_amount = donation_amount
        self.donated_items = donated_items if donated_items else []
        self.note = note

    def serialize(self):
        return {
            'id': self.id,
            'status': self.status.value,
            'user_id': self.user_id,
            'shelter_id': self.shelter_id,
            'donation_type': self.donation_type.value,
            'donation_amount': self.donation_amount,
            'donated_items': self.donated_items,
            'note': self.note,
            'created_at': self.created_at.isoformat()
        }
    