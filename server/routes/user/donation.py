from flask import Blueprint, request, jsonify
from sqlalchemy.orm.attributes import flag_modified
from connection import db
from models import Donation, Shelter, Resource
from _types import DonationType, DonationStatus, ResourceNeed, ShelterStatus, UnitType

user_donations = Blueprint('user_donations', __name__)


# Create a Donation
@user_donations.route('/<int:user_id>/donations/new', methods=['POST'])
def create_donation(user_id):
    try:
        data = request.get_json()

        shelter = Shelter.query.filter_by(id=data['shelter_id']).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        if shelter.status == ShelterStatus.INACTIVE:
            return jsonify({'error': 'Shelter is inactive and cannot receive donations'}), 400

        donation_type = DonationType[data['donation_type'].upper()]
        
        # Validate donated items
        donated_items = []
        if data.get('donated_items', None):
            for item in data['donated_items']:
                resource = Resource.query.filter_by(resource_type=ResourceNeed[item['resource_type'].upper()], shelter_id=data['shelter_id']).first()
                if not resource:
                    return jsonify({'error': f'{item["resource_type"]} is not a valid resource for this shelter'}), 400
                if item['unit'].upper() not in UnitType.__members__:
                    return jsonify({'error': f'Unit {item['unit']} is not a valid unit type'}), 400
                donated_items.append({
                    'resource_type': resource.resource_type.value,
                    'unit': item['unit'],
                    'quantity': item['quantity']
                })
            
        donation = Donation(
            user_id=user_id,
            status=DonationStatus.PENDING,
            shelter_id=data['shelter_id'],
            donation_type=donation_type,
            donation_amount=data.get('donation_amount', None),
            donated_items=donated_items,
            note=data.get('note', None)
        )
        db.session.add(donation)
        db.session.commit()
        return jsonify(donation.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Get All Donations
@user_donations.route('/<int:user_id>/donations/all', methods=['GET'])
def get_all_donations(user_id):
    try:
        donations = Donation.query.filter_by(user_id=user_id).all()
        if not donations:
            return jsonify({'error': 'No donations found for user'}), 404
        
        return jsonify([donation.serialize() for donation in donations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Get A Donation by ID
@user_donations.route('/<int:user_id>/donations/<int:donation_id>', methods=['GET'])
def get_donation_by_id(user_id, donation_id):
    try:
        donation = Donation.query.filter_by(id=donation_id, user_id=user_id).first()
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        return jsonify(donation.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Cancel A Donation
@user_donations.route('/<int:user_id>/donations/<int:donation_id>/cancel', methods=['PUT'])
def cancel_donation(user_id, donation_id):
    try:
        donation = Donation.query.filter_by(id=donation_id, user_id=user_id).first()
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        if donation.status == DonationStatus.ACCEPTED:
            return jsonify({'error': 'Donation has already been accepted and cannot be cancelled'}), 400
        elif donation.status == DonationStatus.REJECTED:
            return jsonify({'error': 'Donation has already been rejected and cannot be cancelled'}), 400
        
        donation.status = DonationStatus.CANCELLED
        flag_modified(donation, 'status')
        db.session.commit()
        
        return jsonify(donation.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
