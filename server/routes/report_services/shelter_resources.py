from flask import jsonify
from models import Shelter, User, Report
from _types import ReportType, ResourceNeed, UserType
from connection import db
import datetime
import os
import pandas as pd
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import uuid


# Datetime Formatter
def format_datetime(value, format="%Y-%m-%d %H:%M:%S"):
    if value is None:
        return ""
    return datetime.datetime.fromisoformat(value).strftime(format)

# Setup Jinja2 Environment
env = Environment(loader=FileSystemLoader('server/routes/report_services/templates'))
env.filters['datetime'] = format_datetime


def generate_shelter_resources_report(data):
    try:
        # Extract filters
        shelter_id = data['shelter_id']
        start_date = datetime.datetime.fromisoformat(data['start_date'])
        end_date = datetime.datetime.fromisoformat(data['end_date'])
        quantity_needed = data.get('quantity_needed')

        # Get shelter
        shelter = Shelter.query.get(shelter_id)
        if not shelter:
            return jsonify({'error': 'Shelter not found'}), 400
        
        # Check if user is authorized to generate report
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 400
        if user.user_type != UserType.TEAM_MEMBER:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Filter resources
        if quantity_needed:
            resource_needs = [resource for resource in shelter.resource_needs if resource.quantity_needed == quantity_needed]
            filtered_by = {"quantity_needed": quantity_needed}
        else:
            resource_needs = shelter.resource_needs
        filtered_by = {}
        
        # Generate report
        current_date = datetime.datetime.now().strftime("%Y%m%d%H%M")        
        shelter_name = shelter.shelter_name.replace(" ", "_")
        report_name = f"{shelter_name}_Resources_Report_{current_date}"

        # Remove shelter_id from resource_needs log
        
        report_data = {
            "resource_needs": resource_needs,
            "resource_change_log": {}
        }

        report = Report(
            name=report_name,
            report_type=ReportType.SHELTER_RESOURCES,
            start_date=start_date,
            end_date=end_date,
            generated_by=data['user_id'],
            generated_at=datetime.datetime.now(),
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
def download_shelter_resources_report(report, file_format):
    try:
        if not report:
            return jsonify({'error': 'Report not found'}), 400
        
        os.makedirs('reports', exist_ok=True)
        file_path = f"reports/{report.name}.{file_format}"

        shelter_data = Shelter.query.get(report.shelter_id)
        user = User.query.get(report.generated_by)

        if file_format == 'pdf':
            template = env.get_template('resource_summary.html')
            html_content = template.render(report=report, shelter_data=shelter_data, generated_by=user)
            HTML(string=html_content, base_url='server/routes/report_services/templates').write_pdf(file_path)
        elif file_format == 'xlsx':
            df = pd.DataFrame(report.data['resource_change_log'])
            df.to_excel(file_path, index=False, engine='openpyxl')
        else:
            return jsonify({'error': 'Invalid file format'}), 400
        
        report.file_path = file_path
        db.session.commit()

        return jsonify(report.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400