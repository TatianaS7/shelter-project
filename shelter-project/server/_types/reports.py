from marshmallow import Schema, fields
from enum import Enum


class ReportType(Enum):
    USER_DONATIONS = 'User Donations'
    SHELTER_DONATIONS = 'Shelter Donations'
    SHELTER_SUMMARY = 'Shelter Summary'
    SHELTER_RESOURCES = 'Shelter Resources'


class Report(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    report_type = fields.Enum(ReportType)
    start_date = fields.DateTime()
    end_date = fields.DateTime()
    generated_by = fields.Int()
    shelter_id = fields.Int()
    data = fields.Dict()
    file_path = fields.Str()


class User_Donations_Report(Schema):
    id = fields.Int(dump_only=True)
    total_donations_amount = fields.Float()
    total_donations_count = fields.Int()
    total_items_donated = fields.Int()
    donations_log = fields.Dict()


class Shelter_Donations_Report(Schema):
    id = fields.Int(dump_only=True)
    total_donations_amount = fields.Float()
    total_donations_count = fields.Int()
    total_items_donated = fields.Int()
    donations_log = fields.Dict()


class Shelter_Summary_Report(Schema):
    id = fields.Int(dump_only=True)
    capacity = fields.Int()
    current_occupancy = fields.Int()
    remaining_capacity = fields.Int()
    funding_summary = fields.Dict()
    donations_summary = fields.Dict()
    resource_needs_summary = fields.Dict()


class Shelter_Resources_Report(Schema):
    id = fields.Int(dump_only=True)
    resource_needs = fields.Dict()
    resource_change_log = fields.Dict()