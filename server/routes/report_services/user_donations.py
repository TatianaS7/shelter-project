from flask import jsonify
from models import User, Donation
from _types import ReportType, DonationType
import datetime


def generate_user_donations_report(data):
    try:
        # Extract filters
        user_id = data['user_id']
        start_date = datetime.datetime.fromisoformat(data['start_date'])
        end_date = datetime.datetime.fromisoformat(data['end_date'])
        donation_type = data.get('donation_type', None)
        
        # Get user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 400
        
        # Get donations from start_date to end_date
        if start_date and end_date:
            donations_in_range = Donation.query.filter(Donation.user_id == user_id, Donation.created_at >= start_date, Donation.created_at <= end_date).all()
        else:
            donations_in_range = Donation.query.filter(Donation.user_id == user_id).all()
        print(donations_in_range)
        
        # Filter donations
        if donation_type:
            donations = [donation for donation in donations_in_range if donation.donation_type == DonationType(donation_type)]
        else:
            donations = donations_in_range
        
        # Generate report
        current_date = datetime.datetime.now().strftime("%m-%d-%Y")
        report_name = f"{user.first_name}_{user.last_name}_Donations_Report_{current_date}"
        total_donations_amount = sum([donation.donation_amount for donation in donations if donation.donation_type == DonationType.MONETARY])
        total_items_donated = sum([len(donation.donated_items) for donation in donations if donation.donated_items is not None])        
        
        report = {
            "name": report_name,
            "report_type": ReportType.USER_DONATIONS.value,
            "start_date": start_date,
            "end_date": end_date,
            "generated_by": data['user_id'],
            "filtered_by": {"donation_type": donation_type},
            "data": {
                "total_donations_amount": total_donations_amount,
                "total_donations_count": len(donations),
                "total_items_donated": total_items_donated,
                "donations_log": [donation.serialize() for donation in donations],
            }
        }
        
        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400