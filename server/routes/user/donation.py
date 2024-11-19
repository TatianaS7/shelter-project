from flask import Blueprint, request, jsonify
from connection import db
from models import Donation, Shelter
from _types import DonationType, ResourceNeed, ShelterStatus

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
        donated_items = [ResourceNeed[item.upper()].value for item in data['donated_items']] if data.get('donated_items', None) else None
            
        donation = Donation(
            user_id=user_id,
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