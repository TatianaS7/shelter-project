from marshmallow import Schema, fields

from _types import DonationType, UserRole, UserType, ResourceNeed, ShelterStatus, DonationStatus, ReportType, UnitType


class Shelter(Schema):
    id = fields.Int(dump_only=True)
    status = fields.Enum(ShelterStatus)
    shelter_name = fields.Str()
    address = fields.Str()
    phone = fields.Str()
    primary_email = fields.Str()
    capacity = fields.Int()
    current_occupancy = fields.Int()
    current_funding = fields.Float()
    funding_needs = fields.Float()
    resource_needs = fields.Dict(fields.Nested('Resource'))
    donations = fields.Dict(fields.Nested('Donation'))
    staff = fields.List(fields.Nested('User'))


class User(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str()
    last_name = fields.Str()
    email = fields.Str()
    user_role = fields.Enum(UserRole, allow_none=True)
    user_type = fields.Enum(UserType)
    password = fields.Str()
    shelter_id = fields.Int()
    donations = fields.List(fields.Nested('Donation'))


class Donation(Schema):
    id = fields.Int(dump_only=True)
    status = fields.Enum(DonationStatus)
    user_id = fields.Int()
    shelter_id = fields.Int()
    donation_type = fields.Enum(DonationType)
    donation_amount = fields.Float()
    donated_items = fields.List(fields.Str(), allow_none=True)
    note = fields.Str(allow_none=True)
    created_at = fields.DateTime()


class Resource(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    quantity = fields.Int()
    unit = fields.Enum(UnitType)
    resource_type = fields.Enum(ResourceNeed)
    shelter_id = fields.Int()
    priority = fields.Int()
    created_at = fields.DateTime()


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