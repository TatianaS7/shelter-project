from flask import Blueprint, request, jsonify
from sqlalchemy.orm.attributes import flag_modified
from connection import db
from models import Shelter, Donation
from _types import DonationType

donations = Blueprint('donations', __name__)


# Get All Donations
@donations.route('<int:shelter_id>/donations/all', methods=['GET'])
def get_all_donations(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        return jsonify([donation.serialize() for donation in shelter.donations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Filter Donations
@donations.route('<int:shelter_id>/donations/filter', methods=['GET'])
def filter_donations(shelter_id):
    try:
        shelter = Shelter.query.filter_by(id=shelter_id).first()
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 404
        
        # Filter Options
        donation_type = request.args.get('donation_type')
        min_amount = request.args.get('min_amount', type=float)
        max_amount = request.args.get('max_amount', type=float)
        donated_item = request.args.get('donated_item')
        donor = request.args.get('donor')

        query = Donation.query.filter_by(shelter_id=shelter_id)

        if donation_type:
            query = query.filter(Donation.donation_type == DonationType[donation_type.upper()])
        if min_amount is not None:
            query = query.filter(Donation.amount >= min_amount)
        if max_amount is not None:
            query = query.filter(Donation.amount <= max_amount)
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