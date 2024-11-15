# Model for User
from connection import db
from _types import UserRole, UserType

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    user_role = db.Column(db.Enum(UserRole), nullable=True)
    user_type = db.Column(db.Enum(UserType), nullable=False)
    shelter_id = db.Column(db.Integer, db.ForeignKey('shelter.id'), nullable=True)
    donations = db.relationship('Donation', backref='user', lazy=True)

    def __init__(self, first_name, last_name, email, user_role, user_type, shelter_id=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.user_type = user_type
        self.shelter_id = shelter_id

        if user_type == UserType.TEAM_MEMBER:
            if not user_role:
                raise ValueError('User role is required for team members')
            self.user_role = user_role
        elif user_type == UserType.DONOR:
            self.user_role = None

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'user_role': self.user_role.value if self.user_role else None,
            'user_type': self.user_type.value,
            'shelter_id': self.shelter_id,
            'donations': [donation.serialize() for donation in self.donations]
        }
    
    # Make a donation
    def make_donation(self, donation):
        self.donations.append(donation)
        db.session.commit()
        return self.serialize()