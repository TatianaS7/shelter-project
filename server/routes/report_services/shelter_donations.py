from flask import jsonify
from models import Shelter
from _types import ReportType, DonationType, DonationStatus
import datetime

def generate_shelter_donations_report(data):
    try:
        # Extract filters
        shelter_id = data['shelter_id']
        start_date = datetime.datetime.fromisoformat(data['start_date'])
        end_date = datetime.datetime.fromisoformat(data['end_date'])
        donation_type = data.get('donation_type')
        donation_max_amount = data.get('donation_max_amount')
        donation_min_amount = data.get('donation_min_amount')
        donated_items = data.get('donated_items')
        status = data.get('status')

        # Get shelter
        shelter = Shelter.query.get(shelter_id)
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 400
        
        # Get donations from start_date to end_date
        donations_in_range = [donation for donation in shelter.donations if start_date <= donation.created_at <= end_date]

        if not donations_in_range:
            return jsonify({'error': 'No donations found'}), 400
        
        # Filter donations
        donations = donations_in_range
        filtered_by = {}

        if donation_type:
            donations = [donation for donation in donations if donation.donation_type == DonationType(donation_type)]
            filtered_by['donation_type'] = donation_type
        if donation_max_amount:
            donations = [donation for donation in donations if donation.donation_amount <= donation_max_amount]
            filtered_by['donation_max_amount'] = donation_max_amount
        if donation_min_amount:
            donations = [donation for donation in donations if donation.donation_amount >= donation_min_amount]
            filtered_by['donation_min_amount'] = donation_min_amount
        if donated_items:
            donations = [donation for donation in donations if donation.donated_items == donated_items]
            filtered_by['donated_items'] = donated_items
        if status:
            donations = [donation for donation in donations if donation.status == DonationStatus(status)]
            filtered_by['status'] = status

        # Generate report
        current_date = datetime.datetime.now().strftime("%m-%d-%Y")
        shelter_name = shelter.shelter_name.replace(" ", "_")
        report_name = f"{shelter_name}_Donations_Report_{current_date}"
        total_donations_amount = sum([donation.donation_amount for donation in donations if donation.donation_type == DonationType.MONETARY])
        total_donations_count = len(donations)
        total_items_donated = sum([len(donation.donated_items) for donation in donations if donation.donated_items is not None])
        donations_log = [donation.serialize() for donation in donations]

        report = {
            "name": report_name,
            "report_type": ReportType.SHELTER_DONATIONS.value,
            "start_date": start_date,
            "end_date": end_date,
            "generated_by": data['user_id'],
            "shelter_id": shelter_id,
            "filtered_by": filtered_by,
            "data": {
                "total_donations_amount": total_donations_amount,
                "total_donations_count": total_donations_count,
                "total_items_donated": total_items_donated,
                "donations_log": donations_log
            }
        }

        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400