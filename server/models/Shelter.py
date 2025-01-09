# Model for Shelters
from connection import db
from _types import UserType, ShelterStatus, DonationType, DonationStatus

class Shelter(db.Model):
    __tablename__ = 'shelter'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(ShelterStatus), nullable=False, default=ShelterStatus.ACTIVE)
    shelter_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip_code = db.Column(db.String(5), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    primary_email = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, nullable=False)
    current_funding = db.Column(db.Float, nullable=False)
    funding_needs = db.Column(db.Float, nullable=False)
    resource_needs = db.relationship('Resource', backref='shelter', lazy=True)
    donations = db.relationship('Donation', backref='shelter', lazy=True)
    staff = db.relationship('User', backref='shelter', lazy=True)

    def __init__(self, status, shelter_name, address, city, state, zip_code, phone, primary_email, capacity, current_occupancy, current_funding, funding_needs, resource_needs, user_info, donations=None, staff=None):
        self.status = status
        self.shelter_name = shelter_name
        self.address = address
        self.city = city
        self.state = state
        self.zip_code = zip_code
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
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
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
                
    
    # Calculate remaining capacity
    def remaining_capacity(self):
        return self.capacity - self.current_occupancy
    
    # Calculate remaining funding needs
    def remaining_funding_needs(self, donation):
        if donation.donation_type == DonationType.MONETARY and donation.status == DonationStatus.ACCEPTED:
            self.current_funding += donation.donation_amount
            self.funding_needs -= donation.donation_amount
            db.session.commit()
            # print(self.funding_needs)
            # print(self.current_funding)
        else:
            print(f"error: {donation.donation_type} is not a monetary donation or status: {donation.status} is not accepted")

        return self.funding_needs
        
    
    # Calculate remaining resource needs
    def remaining_resource_needs(self, donation):
        remaining_resources = {resource.resource_type.value: resource.quantity for resource in self.resource_needs}
        # print(remaining_resources)

        if donation.donation_type == DonationType.PHYSICAL and donation.status == DonationStatus.ACCEPTED:
            for item in donation.donated_items:
                resource_type = item['resource_type']
                quantity = item['quantity']
                if resource_type in remaining_resources:
                    remaining_resources[resource_type] -= quantity
                    # print(remaining_resources[resource_type])
                else:
                    print(f"error: {resource_type} is not a valid resource type")
        else:
            print(f"error: {donation.donation_type} is not a physical donation or status: {donation.status} is not accepted")

        # Update the resource quantity based on the donation
        for resource in self.resource_needs:
            resource.quantity = remaining_resources[resource.resource_type.value]
        
        db.session.commit()

        return [resource.serialize() for resource in self.resource_needs]