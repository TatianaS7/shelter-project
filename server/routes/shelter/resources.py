from flask import Blueprint, request, jsonify
from sqlalchemy.orm.attributes import flag_modified
from connection import db
from models import Shelter, Resource
from _types import ResourceNeed, UnitType

resources = Blueprint('resources', __name__)


# Get All Resource Needs
@resources.route('<int:shelter_id>/resources/all', methods=['GET'])
def get_all_resources(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        resources = Resource.query.filter_by(shelter_id=shelter_id).all()
        return jsonify([resource.serialize() for resource in resources]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Add a Resource Need
@resources.route('<int:shelter_id>/resources/add', methods=['PUT'])
def add_resource(shelter_id):
    try:
        data = request.get_json()

        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        for resource_data in data['resources']:
            # Check if resource already exists
            existing_resource = Resource.query.filter_by(resource_type=ResourceNeed[resource_data['resource_type'].upper()], shelter_id=shelter_id).first()
            if existing_resource:
                existing_resource.quantity += resource_data['quantity']
                existing_resource.priority = resource_data['priority']
                flag_modified(existing_resource, 'quantity')
                flag_modified(existing_resource, 'priority')
            else:
                new_resource = Resource(
                    quantity=resource_data['quantity'],
                    unit=UnitType[resource_data['unit'].upper()],
                    resource_type=ResourceNeed[resource_data['resource_type'].upper()],
                    shelter_id=shelter_id,
                    priority=resource_data['priority']
                )
                db.session.add(new_resource)
        
        db.session.commit()
        return jsonify(new_resource.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Remove a Resource Need
@resources.route('<int:shelter_id>/resources/remove', methods=['PUT'])
def remove_resource(shelter_id):
    try:
        data = request.get_json()

        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        for resource in data['resources']:
            resource = Resource.query.filter_by(id=resource['id']).first()
            if not resource:
                return jsonify({'error': 'Resource not found'}), 404
            db.session.delete(resource)

        db.session.commit()
        return jsonify(shelter.resource_needs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400