from flask import jsonify
from models import Shelter
from _types import ReportType, DonationType
import datetime

def generate_shelter_summary_report(data):
    try:
        # Extract data
        shelter_id = data['shelter_id']
        start_date = datetime.datetime.fromisoformat(data['start_date'])
        end_date = datetime.datetime.fromisoformat(data['end_date'])

        # Get shelter
        shelter = Shelter.query.get(shelter_id)
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 400
        
        # Get donations from start_date to end_date
        donations_in_range = [donation for donation in shelter.donations if start_date <= donation.created_at <= end_date]
        
        # Generate report
        current_date = datetime.datetime.now().strftime("%m-%d-%Y")
        shelter_name = shelter.shelter_name.replace(" ", "_")
        report_name = f"{shelter_name}_Resources_Report_{current_date}"
        funding_summary = {
            "current_funding": shelter.current_funding,
            "funding_needs": shelter.funding_needs,
        }
        donations_summary = {
            "total_donations_amount": sum([donation.donation_amount for donation in donations_in_range if donation.donation_type == DonationType.MONETARY]),
            "total_donations_count": len(donations_in_range),
            "total_items_donated": sum([len(donation.donated_items) for donation in donations_in_range if donation.donated_items is not None]),
            "donations_log": [donation.serialize() for donation in donations_in_range],
        }
        resource_needs_summary = {
            "resource_needs": shelter.remaining_resource_needs(),
            "resouce_change_log": {},
        }
        
        report = {
            "name": report_name,
            "report_type": ReportType.SHELTER_SUMMARY.value,
            "start_date": start_date,
            "end_date": end_date,
            "generated_by": data['user_id'],
            "shelter_id": shelter_id,
            "data": {
                "capacity": shelter.capacity,
                "current_occupancy": shelter.current_occupancy,
                "remaining_capacity": shelter.remaining_capacity(),
                "funding_summary": funding_summary,
                "donations_summary": donations_summary,
                "resource_needs_summary": resource_needs_summary
            }
        }

        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
