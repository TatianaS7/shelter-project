from flask import Blueprint, request, jsonify, send_file
import pandas as pd # Excel generation
import pdfkit # PDF generation
import json
from connection import db
from models import Report, User
from _types import UserType, ReportType
from routes.report_services import generate_shelter_resources_report, generate_user_donations_report, download_shelter_donations_report, generate_shelter_donations_report, generate_shelter_summary_report

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
            if user.user_type != UserType.TEAM_MEMBER:
                return jsonify({'error': 'Unauthorized'}), 401
            return generate_shelter_donations_report(data)

        # Generate Shelter Summary Report
        if report_type == ReportType.SHELTER_SUMMARY.value:
            if user.user_type != UserType.TEAM_MEMBER:
                return jsonify({'error': 'Unauthorized'}), 401
            return generate_shelter_summary_report(data)

        return jsonify({'error': 'Invalid Report Type'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# Download Report
@reports.route('/download-report/<int:report_id>', methods=['POST'])
def download_report(report_id):
    try:
        data = request.get_json()

        report_type = data['report_type']
        file_format = data['file_format']
        user = User.query.get(data['user_id'])
        
        # Get report
        report = Report.query.get(report_id)
        
        # Download Shelter Resources Report
        if report_type == ReportType.SHELTER_RESOURCES.value:
            if user.user_type != UserType.TEAM_MEMBER or report.shelter_id != user.shelter_id:
                return jsonify({'error': 'Unauthorized'}), 401
            return download_shelter_resources_report(report, file_format)

        # Download User Donations Report
        if report_type == ReportType.USER_DONATIONS.value:
            return download_user_donations_report(report, file_format)

        # Download Shelter Donations Report
        if report_type == ReportType.SHELTER_DONATIONS.value:
            if user.user_type != UserType.TEAM_MEMBER:
                return jsonify({'error': 'Unauthorized'}), 401
            return download_shelter_donations_report(report, file_format)

        # Download Shelter Summary Report
        if report_type == ReportType.SHELTER_SUMMARY.value:
            if user.user_type != UserType.TEAM_MEMBER or report.shelter_id != user.shelter_id:
                return jsonify({'error': 'Unauthorized'}), 401
            return download_shelter_summary_report(report, file_format)
        
        return jsonify({'error': 'Invalid Report Type'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400