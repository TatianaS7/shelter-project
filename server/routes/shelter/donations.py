from flask import Blueprint, request, jsonify
from sqlalchemy.orm.attributes import flag_modified
from connection import db
from models import Shelter, Donation, User
from _types import DonationType, DonationStatus, UserRole

donations = Blueprint('donations', __name__)


# Get a Shelter's Donation
@donations.route('/<int:shelter_id>/donations/<int:donation_id>', methods=['GET'])
def get_donation(shelter_id, donation_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        donation = Donation.query.filter_by(id=donation_id, shelter_id=shelter_id).first()
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        return jsonify(donation.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Get All Donations
@donations.route('/<int:shelter_id>/donations/all', methods=['GET'])
def get_all_donations(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        return jsonify([donation.serialize() for donation in shelter.donations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    


# Update Donation Status (Accept or Reject)
@donations.route('/<int:shelter_id>/donations/<int:donation_id>/update', methods=['PUT'])
def handle_donation(shelter_id, donation_id):
    try:
        data = request.get_json()
        if 'action' not in data:
            return jsonify({'error': 'Action is required'}), 400
        if 'user_id' not in data:
            return jsonify({'error': 'User ID is required'}), 400
        
        user = User.query.filter_by(id=data['user_id'], shelter_id=shelter_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.user_role != UserRole.ADMIN:
            return jsonify({'error': 'User does not have permission to perform this action'}), 403

        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        donation = Donation.query.filter_by(id=donation_id, shelter_id=shelter_id).first()
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        if donation.status == DonationStatus.CANCELLED:
            return jsonify({'error': 'Donation has already been cancelled by user and cannot be acted on'}), 400
        
        # If accepting donation, update shelter's resource needs
        if data['action'] == DonationStatus.ACCEPTED.value:
            if donation.donation_type == DonationType.PHYSICAL:
                donation.status = DonationStatus.ACCEPTED                  
                shelter.remaining_resource_needs(donation)
            elif donation.donation_type == DonationType.MONETARY:
                donation.status = DonationStatus.ACCEPTED
                shelter.remaining_funding_needs(donation)

        elif data['action'] == DonationStatus.REJECTED.value:
            donation.status = DonationStatus.REJECTED
        else:
            return jsonify({'error': f"{data['action']} is an invalid action"}), 400

        db.session.commit()
        return jsonify(donation.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
        


# Filter Donations
@donations.route('/<int:shelter_id>/donations/filter', methods=['GET'])
def filter_donations(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        # Filter Options
        donation_type = request.args.get('donation_type')
        status = request.args.get('status')
        min_amount = request.args.get('min_amount', type=float)
        max_amount = request.args.get('max_amount', type=float)
        donated_item = request.args.get('donated_item')
        donor = request.args.get('donor')

        query = Donation.query.filter_by(shelter_id=shelter_id)

        if donation_type:
            query = query.filter(Donation.donation_type == DonationType[donation_type.upper()])
        if status:
            query = query.filter(Donation.status == DonationStatus[status.upper()])
        if min_amount is not None:
            query = query.filter(Donation.donation_amount >= min_amount)
        if max_amount is not None:
            query = query.filter(Donation.donation_amount <= max_amount)
        if donated_item:
            query = query.filter(Donation.donated_items.contains(donated_item))
        if donor:
            query = query.filter(Donation.user_id == donor)

        donations = query.all()
        if donations == []:
            return jsonify({'error': 'No donations found with the set filters'}), 404
        
        return jsonify([donation.serialize() for donation in donations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400