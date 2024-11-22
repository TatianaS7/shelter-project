from flask import jsonify
from models import Shelter, Report, User
from _types import ReportType, DonationType, UserType
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


def generate_shelter_summary_report(data):
    try:
        from routes.report_services import generate_funding_graph

        # Extract data
        shelter_id = data['shelter_id']
        user_id = data['user_id']
        start_date = datetime.datetime.fromisoformat(data['start_date'])
        end_date = datetime.datetime.fromisoformat(data['end_date'])

        # Get shelter
        shelter = Shelter.query.get(shelter_id)
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 400
        
        # Check if user is authorized to generate report
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 400
        if user.user_type != UserType.TEAM_MEMBER:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Get donations from start_date to end_date
        donations_in_range = [donation for donation in shelter.donations if start_date <= donation.created_at <= end_date]
        
        # Generate report
        current_date = datetime.datetime.now().strftime("%m-%d-%Y")
        shelter_name = shelter.shelter_name.replace(" ", "_")
        report_name = f"{shelter_name}_Resources_Report_{current_date}"

        # Remove shelter_id from donations log
        donations_log = [donation.serialize() for donation in donations_in_range]
        for donation in donations_log:
            donation.pop('shelter_id')
        
        # Generate funding chart
        funding_graph_path = generate_funding_graph(shelter.current_funding, shelter.funding_needs)

        # Generate report data
        funding_summary = {
            "current_funding": shelter.current_funding,
            "funding_needs": shelter.funding_needs,
        }
        donations_summary = {
            "total_donations_amount": sum([donation.donation_amount for donation in donations_in_range if donation.donation_type == DonationType.MONETARY]),
            "total_donations_count": len(donations_in_range),
            "total_items_donated": sum([len(donation.donated_items) for donation in donations_in_range if donation.donated_items is not None]),
            "donations_log": donations_log
        }
        resource_needs_summary = {
            "resource_needs": shelter.remaining_resource_needs(),
            "resouce_change_log": {},
        }
        
        report_data = {
                "capacity": shelter.capacity,
                "current_occupancy": shelter.current_occupancy,
                "remaining_capacity": shelter.remaining_capacity(),
                "funding_summary": funding_summary,
                "donations_summary": donations_summary,
                "resource_needs_summary": resource_needs_summary,
                "funding_graph": funding_graph_path
        }

        report = Report(
            name=report_name,
            report_type=ReportType.SHELTER_SUMMARY,
            start_date=start_date,
            end_date=end_date,
            generated_by=data['user_id'],
            shelter_id=shelter_id,
            filtered_by={},
            data=report_data,
            file_path=None
        )
        db.session.add(report)
        db.session.commit()

        return jsonify(report.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Download Report
def download_shelter_summary_report(report, file_format):
    try:
        if not report:
            return jsonify({'error': 'Report not found'}), 400
        
        os.makedirs('reports', exist_ok=True)
        file_path = f"reports/{report.name}.{file_format}"

        shelter = Shelter.query.get(report.shelter_id)
        user = User.query.get(report.generated_by)
        shelter_name = shelter.shelter_name if shelter else None

        if file_format == 'pdf':
            template = env.get_template('shelter_summary.html')
            html_content = template.render(report=report, shelter_name=shelter_name, generated_by=user)
            HTML(string=html_content, base_url='server/routes/report_services/templates').write_pdf(file_path)
        elif file_format == 'xlsx':
            df = pd.DataFrame(report.data['donations_summary']['donations_log'])
            df.to_excel(file_path, index=False, engine='openpyxl')
        else:
            return jsonify({'error': 'Invalid file format'}), 400
        
        report.file_path = file_path
        db.session.commit()

        return jsonify(report.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
