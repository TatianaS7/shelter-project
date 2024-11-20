from flask import jsonify
from models import Shelter
from _types import ReportType, ResourceNeed
import datetime

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
        
        # Filter resources
        if quantity_needed:
            resource_needs = [resource for resource in shelter.resource_needs if resource.quantity_needed == quantity_needed]
            filtered_by = {"quantity_needed": quantity_needed}
        else:
            resource_needs = shelter.resource_needs
        filtered_by = {}
        
        # Generate report
        current_date = datetime.datetime.now().strftime("%m-%d-%Y")
        shelter_name = shelter.shelter_name.replace(" ", "_")
        report_name = f"{shelter_name}_Resources_Report_{current_date}"
        
        report = {
            "name": report_name,
            "report_type": ReportType.SHELTER_RESOURCES.value,
            "start_date": start_date,
            "end_date": end_date,
            "generated_by": data['user_id'],
            "shelter_id": shelter_id,
            "filtered_by": filtered_by,
            "data": {
                "resource_needs": resource_needs,
                "resouce_change_log": {}
            }
        }
        
        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400