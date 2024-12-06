from flask import Blueprint, request, jsonify
from connection import db
from models import Shelter, User, Resource
from _types import UserRole, UserType, ShelterStatus, ResourceNeed, UnitType

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
            status=ShelterStatus.ACTIVE,
            shelter_name=data['shelter_name'], 
            address=data['address'], 
            phone=data['phone'], 
            primary_email=data['primary_email'],
            capacity=data['capacity'],
            current_occupancy=data['current_occupancy'],
            current_funding=data['current_funding'],
            funding_needs=data['funding_needs'],
            user_info=admin_user
        )
        db.session.add(shelter)
        db.session.commit()

        # Update shelter_id for admin user
        admin_user.shelter_id = shelter.id
        db.session.commit()

        # Create resource needs for shelter
        for resource in data['resource_needs']:
            new_resource = Resource(
                resource_type=ResourceNeed[resource['resource_type'].upper()],
                quantity=resource['quantity'],
                unit=UnitType[resource['unit'].upper()],
                shelter_id=shelter.id,
                priority=resource.get('priority', 1)
            )
            db.session.add(new_resource)
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

        db.session.commit()
        return jsonify(shelter.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Deactivate a Shelter by ID (Soft Delete - Set status to INACTIVE)
@shelters.route('/<int:id>/deactivate', methods=['PUT'])
def delete_shelter(id):
    try:
        data = request.get_json()
        if not 'user_id' in data:
            return jsonify({'error': 'User ID is required'}), 400
        
        shelter = Shelter.query.get(id)
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        user = next((u for u in shelter.staff if u.id == data['user_id']), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.user_role != UserRole.ADMIN:
            return jsonify({'error': 'User does not have permission to deactivate shelter'}), 403
                    
        shelter.status = ShelterStatus.INACTIVE
        db.session.commit()
        return jsonify({'message': 'Shelter is now inactive'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Recover Shelter (Set status to ACTIVE)
@shelters.route('/<int:id>/recover', methods=['PUT'])
def recover_shelter(id):
    try:
        data = request.get_json()
        if not 'user_id' in data:
            return jsonify({'error': 'User ID is required'}), 400
        
        shelter = Shelter.query.get(id)
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        user = next((u for u in shelter.staff if u.id == data['user_id']), None)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.user_role != UserRole.ADMIN:
            return jsonify({'error': 'User does not have permission to recover shelter'}), 403
                    
        shelter.status = ShelterStatus.ACTIVE
        db.session.commit()
        return jsonify({'message': 'Shelter is now active'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400