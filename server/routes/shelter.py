from flask import Blueprint, request, jsonify
from connection import db
from models import Shelter, User
from _types import UserRole, UserType

shelters = Blueprint('shelters', __name__)


# Create a Shelter
@shelters.route('/register', methods=['POST'])
def register_shelter():
    try:
        data = request.get_json()

        # Create admin user
        user_data = data['user_info']
        admin_user = User(
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
            user_role=UserRole.ADMIN,
            user_type=UserType.TEAM_MEMBER,
            shelter_id=None
        )
        db.session.add(admin_user)
        db.session.commit()

        # Create shelter and associate with admin user
        shelter = Shelter(
            shelter_name=data['shelter_name'], 
            address=data['address'], 
            phone=data['phone'], 
            primary_email=data['primary_email'],
            capacity=data['capacity'],
            current_occupancy=data['current_occupancy'],
            current_funding=data['current_funding'],
            funding_needs=data['funding_needs'],
            resource_needs=data['resource_needs'],
            user_info=admin_user
        )
        db.session.add(shelter)
        db.session.commit()

        # Update shelter_id for admin user
        admin_user.shelter_id = shelter.id
        db.session.commit()

        return jsonify(shelter.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# Get All Shelters
@shelters.route('/all', methods=['GET'])
def get_all_shelters():
    try:
        shelters = Shelter.query.all()
        return jsonify([shelter.serialize() for shelter in shelters]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# Get Shelter by ID
@shelters.route('/<int:id>', methods=['GET'])
def get_shelter_by_id(id):
    try:
        shelter = Shelter.query.get(id)
        return jsonify(shelter.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# Update Shelter by ID
@shelters.route('/<int:id>/update', methods=['PUT'])
def update_shelter_by_id(id):
    try:
        data = request.get_json()
        shelter = Shelter.query.get(id)

        if 'shelter_name' in data:
            shelter.shelter_name = data['shelter_name']
        if 'address' in data:
            shelter.address = data['address']
        if 'phone' in data:
            shelter.phone = data['phone']
        if 'primary_email' in data:
            shelter.primary_email = data['primary_email']
        if 'capacity' in data:
            shelter.capacity = data['capacity']
        if 'current_occupancy' in data:
            shelter.current_occupancy = data['current_occupancy']
        if 'current_funding' in data:
            shelter.current_funding = data['current_funding']
        if 'funding_needs' in data:
            shelter.funding_needs = data['funding_needs']
        if 'resource_needs' in data:
            shelter.resource_needs = data['resource_needs']

        db.session.commit()
        return jsonify(shelter.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# Delete Shelter by ID (Soft Delete)
