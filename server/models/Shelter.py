# Model for Shelters
from connection import db
from _types import UserType, ShelterStatus

class Shelter(db.Model):
    __tablename__ = 'shelter'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(ShelterStatus), nullable=False, default=ShelterStatus.ACTIVE)
    shelter_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    primary_email = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, nullable=False)
    current_funding = db.Column(db.Float, nullable=False)
    funding_needs = db.Column(db.Float, nullable=False)
    resource_needs = db.relationship('Resource', backref='shelter', lazy=True)
    donations = db.relationship('Donation', backref='shelter', lazy=True)
    staff = db.relationship('User', backref='shelter', lazy=True)

    def __init__(self, status, shelter_name, address, phone, primary_email, capacity, current_occupancy, current_funding, funding_needs, resource_needs, user_info, donations=None, staff=None):
        self.status = status
        self.shelter_name = shelter_name
        self.address = address
        self.phone = phone
        self.primary_email = primary_email
        self.capacity = capacity
        self.current_occupancy = current_occupancy
        self.current_funding = current_funding
        self.funding_needs = funding_needs
        self.resource_needs = resource_needs if resource_needs else []
        self.donations = donations if donations else []
        self.staff = staff if staff else []

        if user_info:
            self.staff.append(user_info)

    # Returns a dictionary representation of the shelter
    def serialize(self):
        return {
            'id': self.id,
            'status': self.status.value,
            'shelter_name': self.shelter_name,
            'address': self.address,
            'phone': self.phone,
            'primary_email': self.primary_email,
            'capacity': self.capacity,
            'current_occupancy': self.current_occupancy,
            'current_funding': self.current_funding,
            'funding_needs': self.funding_needs,
            'resource_needs': [resource.serialize() for resource in self.resource_needs],
            'donations': [donation.serialize() for donation in self.donations],
            'staff': [user.serialize() for user in self.staff if user.user_type == UserType.TEAM_MEMBER]
        }
                
    # Receive a donation
    def receive_donation(self, donation):
        self.donations.append(donation)
    
    # Calculate remaining capacity
    def remaining_capacity(self):
        return self.capacity - self.current_occupancy
    
    # Calculate remaining funding needs
    def remaining_funding_needs(self):
        return self.funding_needs - self.current_funding
    
    # Calculate remaining resource needs
    def remaining_resource_needs(self):
        return self.resource_needs