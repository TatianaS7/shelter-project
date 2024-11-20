from flask import Blueprint, request, jsonify
from connection import db
from models import Report, User
from _types import UserRole, UserType, ReportType
from routes.report_services import generate_shelter_resources_report, generate_user_donations_report, generate_shelter_donations_report, generate_shelter_summary_report

reports = Blueprint('reports', __name__)


# Generate a Report
@reports.route('/generate-report', methods=['POST'])
def generate_report():
    try:
        data = request.get_json()

        # Get report filters
        report_type = data['report_type']
        user = User.query.get(data['user_id'])

        # Generate Shelter Resources Report
        if report_type == ReportType.SHELTER_RESOURCES.value:
            if user.user_type != UserType.TEAM_MEMBER:
                return jsonify({'error': 'Unauthorized'}), 401
            return generate_shelter_resources_report(data)

        # Generate User Donations Report
        if report_type == ReportType.USER_DONATIONS.value:
            return generate_user_donations_report(data)

        # Generate Shelter Donations Report
        if report_type == ReportType.SHELTER_DONATIONS.value:
            return generate_shelter_donations_report(data)

        # Generate Shelter Summary Report
        if report_type == ReportType.SHELTER_SUMMARY.value:
            if user.user_type != UserType.TEAM_MEMBER:
                return jsonify({'error': 'Unauthorized'}), 401
            return generate_shelter_summary_report(data)

        return jsonify({'error': 'Invalid Report Type'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
