from models import User, Donation, Shelter
import json
from connection import db
from _types import UserRole, UserType, DonationType, ResourceNeed

def seed_shelters():
    db.session.query(Shelter).delete()

    with open('server/seed_data/seedShelters.json') as f:
        data = json.load(f)
        
        for shelter in data:
            user_info = shelter.pop('user_info', None)
            if not user_info:
                raise ValueError('User info is required for shelter')
            
            # Create admin user
            admin_user = User(
                first_name=user_info['first_name'],
                last_name=user_info['last_name'],
                email=user_info['email'],
                user_role=UserRole.ADMIN,
                user_type=UserType.TEAM_MEMBER,
                shelter_id=None
            ) 
            db.session.add(admin_user)
            db.session.commit()

            # Create shelter and associate with admin user        
            new_shelter = Shelter(
                shelter_name=shelter['shelter_name'], 
                address=shelter['address'], 
                phone=shelter['phone'], 
                primary_email=shelter['primary_email'],
                capacity=shelter['capacity'],
                current_occupancy=shelter['current_occupancy'],
                current_funding=shelter['current_funding'],
                funding_needs=shelter['funding_needs'],
                resource_needs=shelter['resource_needs'],
                user_info=admin_user
            )
            db.session.add(new_shelter)
            db.session.commit()

            # Update shelter_id for admin user
            admin_user.shelter_id = new_shelter.id
            db.session.commit()


def seed_users():
    db.session.query(User).delete()

    with open('server/seed_data/seedUsers.json') as f:
        data = json.load(f)
        
        for user in data:
            user_role = None

            user_type = UserType[user['user_type'].upper()]

            if user_type == UserType.TEAM_MEMBER:
                user_role = UserRole[user['user_role'].upper()]
            elif user_type == UserType.DONOR:
                user_role = None
            new_user = User(
                first_name=user['first_name'],
                last_name=user['last_name'],
                email=user['email'],
                user_role=user_role,
                user_type=user_type,
                shelter_id=user['shelter_id']
            )

            db.session.add(new_user)
        db.session.commit()


def seed_donations():
    db.session.query(Donation).delete()

    with open('server/seed_data/seedDonations.json') as f:
        data = json.load(f)
        
        for donation in data:
            donated_items = None
            donation_amount = None

            donation_type = DonationType[donation['donation_type'].upper()]

            if donation_type == DonationType.MONETARY:
                donated_items = None
                donation_amount = donation['donation_amount']
            elif donation_type == DonationType.PHYSICAL:
                donated_items = donation['donated_items']
                donation_amount = None
            
            new_donation = Donation(
                user_id=donation['user_id'],
                shelter_id=donation['shelter_id'],
                donation_type=donation['donation_type'],
                donation_amount=donation_amount,
                donated_items=donated_items,
                note=donation.get('note', None)
            )

            db.session.add(new_donation)
        db.session.commit()


def seed_all():
    seed_shelters()
    seed_users()
    seed_donations()
    print('*** Data Seeded Successfully ***')