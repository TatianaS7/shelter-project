from flask import Blueprint, request, jsonify
from connection import db
from models import User
from _types import UserRole

users = Blueprint('users', __name__)

# Create a User
@users.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        user = User(
            first_name=data['first_name'], 
            last_name=data['last_name'], 
            email=data['email'], 
            user_role=data['user_role'],
            user_type=data['user_type'],
            shelter_id=data['shelter_id']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({user.serialize()}), 201
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
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Update User by ID
@users.route('/update/<int:id>', methods=['PUT'])
def update_user_by_id(id):
    try:
        data = request.get_json()
        user = User.query.get(id)
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.email = data['email']
        user.user_role = data['user_role']
        user.user_type = data['user_type']
        user.shelter_id = data['shelter_id']
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Delete User by ID
@users.route('/delete/<int:id>', methods=['DELETE'])
def delete_user_by_id(id):
    try:
        user = User.query.get(id)
        db.session.delete(user)
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
