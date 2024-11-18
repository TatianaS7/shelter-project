from flask import Blueprint, request, jsonify
from sqlalchemy.orm.attributes import flag_modified
from connection import db
from models import Shelter
from _types import ResourceNeed

resources = Blueprint('resources', __name__)


# Get All Resource Needs
@resources.route('<int:shelter_id>/resources/all', methods=['GET'])
def get_all_resources(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        return jsonify(shelter.resource_needs), 200
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
        
        # Check if resource type is valid
        for resource in data['resources']:
            if resource.upper() in [r.name for r in ResourceNeed]:
                if resource in shelter.resource_needs:
                    return jsonify({'error': f'{resource} already exists in the resource needs list'}), 400
                else:
                    print(resource)
                    shelter.resource_needs.append(resource)
                    flag_modified(shelter, 'resource_needs')
            else:
                return jsonify({'error': f'{resource} is not a valid resource type'}), 400
        db.session.commit()
        return jsonify(shelter.resource_needs), 200
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
        
        # Check if resource type is valid
        for resource in data['resources']:
            if resource.upper() in [r.name for r in ResourceNeed]:
                if resource in shelter.resource_needs:
                    shelter.resource_needs.remove(resource)
                    flag_modified(shelter, 'resource_needs')
                else:
                    return jsonify({'error': f'{resource} does not exist in the resource needs list'}), 400
            else:
                return jsonify({'error': f'{resource} is not a valid resource type'}), 400
        db.session.commit()
        return jsonify(shelter.resource_needs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400