# Model for Reports
from connection import db
from _types import ReportType

class Report(db.Model):
    __tablename__ = 'report'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    report_type = db.Column(db.Enum(ReportType), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    generated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    shelter_id = db.Column(db.Integer, db.ForeignKey('shelter.id'), nullable=True)
    filtered_by = db.Column(db.JSON, nullable=True)
    data = db.Column(db.JSON, nullable=False)
    file_path = db.Column(db.String(255), nullable=True)

    def __init__(self, name, report_type, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path):
        self.name = name
        self.report_type = report_type
        self.start_date = start_date
        self.end_date = end_date
        self.generated_by = generated_by
        self.shelter_id = shelter_id
        self.filtered_by = filtered_by
        self.data = data
        self.file_path = file_path

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'report_type': self.report_type.value,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'generated_by': self.generated_by,
            'shelter_id': self.shelter_id,
            'filtered_by': self.filtered_by,
            'data': self.data,
            'file_path': self.file_path
        }
    

# User Donations Report
class User_Donations_Report(Report):
    __tablename__ = 'user_donations_report'

    id = db.Column(db.Integer, db.ForeignKey('report.id'), primary_key=True)
    total_donations_amount = db.Column(db.Float, nullable=False)
    total_donations_count = db.Column(db.Integer, nullable=False)
    total_items_donated = db.Column(db.Integer, nullable=False)
    donations_log = db.Column(db.JSON, nullable=False)

    def __init__(self, name, start_date, end_date, generated_by, filtered_by, data, file_path):
        super().__init__(name, ReportType.USER_DONATIONS, start_date, end_date, generated_by, None, filtered_by, data, file_path)
        

# Shelter Donations Report
class Shelter_Donations_Report(Report):
    __tablename__ = 'shelter_donations_report'

    id = db.Column(db.Integer, db.ForeignKey('report.id'), primary_key=True)
    total_donations_amount = db.Column(db.Float, nullable=False)
    total_donations_count = db.Column(db.Integer, nullable=False)
    total_items_donated = db.Column(db.Integer, nullable=False)
    donations_log = db.Column(db.JSON, nullable=False)

    def __init__(self, name, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path):
        super().__init__(name, ReportType.SHELTER_DONATIONS, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path)


# Shelter Summary Report
class Shelter_Summary_Report(Report):
    __tablename__ = 'shelter_summary_report'

    id = db.Column(db.Integer, db.ForeignKey('report.id'), primary_key=True)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, nullable=False)
    remaining_capacity = db.Column(db.Integer, nullable=False)
    funding_summary = db.Column(db.JSON, nullable=False)
    donations_summary = db.Column(db.JSON, nullable=False)
    resource_needs_summary = db.Column(db.JSON, nullable=False)

    def __init__(self, name, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path):
        super().__init__(name, ReportType.SHELTER_SUMMARY, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path)


# Shelter Resources Report
class Shelter_Resources_Report(Report):
    __tablename__ = 'shelter_resources_report'

    id = db.Column(db.Integer, db.ForeignKey('report.id'), primary_key=True)
    resource_needs = db.Column(db.JSON, nullable=False)
    resource_change_log = db.Column(db.JSON, nullable=False)

    def __init__(self, name, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path):
        super().__init__(name, ReportType.SHELTER_RESOURCES, start_date, end_date, generated_by, shelter_id, filtered_by, data, file_path)