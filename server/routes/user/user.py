from flask import Blueprint, request, jsonify
from connection import db
from models import User
from _types import UserRole, UserType

users = Blueprint('users', __name__)

# Create a User
@users.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        # Check if user exists
        user = User.query.filter_by(email=data['email']).first()
        if user:
            return jsonify({'error': 'User with that email already exists'}), 400
        
        user_type = UserType[data['user_type'].upper()]
        user_role = None        
        if user_type == UserType.TEAM_MEMBER:
            user_role = UserRole[data['user_role'].upper()]
        
        user = User(
            first_name=data['first_name'], 
            last_name=data['last_name'], 
            email=data['email'], 
            user_role=user_role,
            user_type=user_type,
            shelter_id=data['shelter_id']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Get All Users
@users.route('/all', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Get User by ID
@users.route('/<int:id>', methods=['GET'])
def get_user_by_id(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Update User by ID
@users.route('/<int:id>/update', methods=['PUT'])
def update_user_by_id(id):
    try:
        data = request.get_json()

        user = User.query.get(id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Delete User by ID
# @users.route('/delete/<int:id>', methods=['DELETE'])
# def delete_user_by_id(id):
#     try:
#         user = User.query.get(id)
#         db.session.delete(user)
#         db.session.commit()
#         return jsonify(user.serialize()), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400
