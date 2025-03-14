from flask import Blueprint, request, jsonify
from connection import db
from models import User, Shelter
from _types import UserRole, UserType

staff = Blueprint('staff', __name__)


# Get All Staff Members
@staff.route('/<int:shelter_id>/staff/all', methods=['GET'])
def get_all_staff(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        # Get all users associated with the shelter if user type is TEAM_MEMBER
        return jsonify([user.serialize() for user in shelter.staff if user.user_type == UserType.TEAM_MEMBER]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Get A Staff Member by ID
@staff.route('/<int:shelter_id>/staff/<int:staff_id>', methods=['GET'])
def get_staff_by_id(shelter_id, staff_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        staff = User.query.filter_by(id=staff_id).first()
        if not staff:
            return jsonify({'error': 'Staff member not found'}), 404
        
        return jsonify(staff.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Update Staff Member Privileges (Admin Only)
@staff.route('/<int:shelter_id>/staff/privileges', methods=['PUT'])
def register_staff(shelter_id):
    try:
        data = request.get_json()

        # Check if shelter exists
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        # Check if current user is an admin
        user = User.query.filter_by(id=data['user_id']).first()
        if user.user_role != UserRole.ADMIN:
            return jsonify({'error': f'{user.first_name} {user.last_name} is not an admin and can not perform this action'}), 401
        
        # Find shelter staff member
        staff = User.query.filter_by(id=data['staff_id']).first()
        if not staff:
            return jsonify({'error': 'Staff member not found'}), 404
        
        # Prevent admin from demoting themselves
        if staff.id == user.id:
            return jsonify({'error': 'Admin can not update their own status'}), 400
        
        if data['role'] not in [UserRole.ADMIN.value, UserRole.VIEWER.value]:
            return jsonify({'error': 'Invalid role specified'}), 400
        
        staff.user_role = data['role'].upper()
        
        db.session.add(staff)
        db.session.commit()
        return jsonify(staff.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Remove Staff Member (Admin Only)
@staff.route('/<int:shelter_id>/staff/remove', methods=['DELETE'])
def remove_staff_member(shelter_id):
    try:
        data = request.get_json()

        # Check if shelter exists
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        # Check if current user is an admin
        user = User.query.filter_by(id=data['user_id']).first()
        if user.user_role != UserRole.ADMIN:
            return jsonify({'error': f'{user.first_name} {user.last_name} is not an admin and can not perform this action'}), 401
        
        # Find shelter staff member
        staff = User.query.filter_by(id=data['staff_id']).first()
        if not staff:
            return jsonify({'error': 'Staff member not found'}), 404
        
        # Prevent admin from removing themselves
        if staff.id == user.id:
            return jsonify({'error': 'Admin can not remove themselves'}), 400
        
        db.session.delete(staff)
        db.session.commit()
        return jsonify({'message': f'{staff.first_name} {staff.last_name} was successfuly removed as a team member'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
