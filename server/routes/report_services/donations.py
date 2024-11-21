from flask import jsonify
from models import Shelter, Report, User, Donation
from _types import ReportType, DonationType, DonationStatus, UserType
from connection import db
import datetime
import os
import pandas as pd
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader


# Datetime Formatter
def format_datetime(value, format="%Y-%m-%d %H:%M:%S"):
    if value is None:
        return ""
    return datetime.datetime.fromisoformat(value).strftime(format)

# Setup Jinja2 Environment
env = Environment(loader=FileSystemLoader('server/routes/report_services/templates'))
env.filters['datetime'] = format_datetime


def generate_donations_report(data):
    try:
        # Extract filters
        shelter_id = data.get('shelter_id', None)
        user_id = data.get('user_id', None)
        start_date = datetime.datetime.fromisoformat(data['start_date'])
        end_date = datetime.datetime.fromisoformat(data['end_date'])
        donation_type = data.get('donation_type')
        donation_max_amount = data.get('donation_max_amount')
        donation_min_amount = data.get('donation_min_amount')
        donated_items = data.get('donated_items')
        status = data.get('status')

        # Get user (if provided)
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 400
            
        # Get shelter (if provided)
        shelter = Shelter.query.get(shelter_id) if shelter_id else None
        if shelter_id and not shelter:
            return jsonify({'error': 'Shelter not found'}), 400
        
        # Check if user is authorized to generate report
        if shelter_id and user.user_type != UserType.TEAM_MEMBER:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get donations from start_date to end_date
        if shelter_id:
            donations_in_range = Donation.query.filter(
                Donation.shelter_id == shelter_id,
                Donation.created_at >= start_date,
                Donation.created_at <= end_date
            ).all()
        else:
            donations_in_range = Donation.query.filter(
                Donation.user_id == user_id,
                Donation.created_at >= start_date,
                Donation.created_at <= end_date
            ).all()

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
        if shelter:
            shelter_name = shelter.shelter_name.replace(" ", "_")
            report_name = f"{shelter_name}_Donations_Report_{current_date}"
        else:
            report_name = f"{user.first_name}_{user.last_name}_Donations_Report_{current_date}"
        
        total_donations_amount = sum([donation.donation_amount for donation in donations if donation.donation_type == DonationType.MONETARY])
        total_donations_count = len(donations)
        total_items_donated = sum([len(donation.donated_items) for donation in donations if donation.donated_items is not None])

        # Remove user_id from donations due to redundancy
        donations_log = [donation.serialize() for donation in donations]
        if not shelter:
            for donation in donations_log:
                donation.pop('user_id', None)    
        else:
            for donation in donations_log:
                donation.pop('shelter_id', None)    

        report_data = {
            "total_donations_amount": total_donations_amount,
            "total_donations_count": total_donations_count,
            "total_items_donated": total_items_donated,
            "donations_log": donations_log
        }

        report = Report(
            name=report_name,
            report_type=ReportType.SHELTER_DONATIONS if shelter else ReportType.USER_DONATIONS,
            start_date=start_date,
            end_date=end_date,
            generated_by=user_id,
            shelter_id=shelter_id,
            filtered_by=filtered_by,
            data=report_data,
            file_path=None
        )
        db.session.add(report)
        db.session.commit()

        return jsonify(report.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Download Report
def download_donations_report(report, file_format):
    try:
        # Make sure report exists
        if not report:
            return jsonify({'error': 'Report not found'}), 400
        
        os.makedirs('reports', exist_ok=True)
        file_path = f"reports/{report.name}.{file_format}"

        shelter = Shelter.query.get(report.shelter_id)
        user = User.query.get(report.generated_by)
        shelter_name = shelter.shelter_name if shelter else None
   
        if file_format == 'pdf':
            # Load HTML Template
            template = env.get_template('donations_template.html')
            html_content = template.render(report=report, shelter_name=shelter_name, generated_by=user)  
            HTML(string=html_content, base_url='server/routes/report_services/templates').write_pdf(file_path)    
        elif file_format == 'xlsx':
            df = pd.DataFrame(report.data['donations_log'])
            df.to_excel(file_path, index=False, engine='openpyxl')
        else:
            return jsonify({'error': 'Invalid file format'}), 400
        
        # Update report file path
        report.file_path = file_path
        db.session.commit()
        
        return file_path, None
    except Exception as e:
        return jsonify({'error': str(e)}), 400