from enum import Enum


class UserType(Enum):
    TEAM_MEMBER = 'Team Member'
    DONOR = 'Donor'

class UserRole(Enum):
    ADMIN = 'Admin'
    VIEWER = 'Viewer'

class ResourceNeed(Enum):
    BLANKETS = 'Blankets'
    FOOD = 'Food'
    CLOTHING = 'Clothing'
    HYGIENE = 'Hygiene' 
    WATER = 'Water'
    MEDICINE = 'Medicine'
    OTHER = 'Other'

class UnitType(Enum):
    BAG = 'Bag'
    PACKAGE = 'Package'
    BOX = 'Box'
    BOTTLE = 'Bottle'
    CAN = 'Can'
    ITEM = 'Item'
    MEAL = 'Meal'

class DonationType(Enum):
    MONETARY = 'Monetary'
    PHYSICAL = 'Physical'      

class ShelterStatus(Enum):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class UserStatus(Enum):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'

class DonationStatus(Enum):
    PENDING = 'Pending'
    ACCEPTED = 'Accepted'
    REJECTED = 'Rejected'
    CANCELLED = 'Cancelled'

class ReportType(Enum):
    USER_DONATIONS = 'User Donations'
    SHELTER_DONATIONS = 'Shelter Donations'
    SHELTER_SUMMARY = 'Shelter Summary'
    SHELTER_RESOURCES = 'Shelter Resources'
