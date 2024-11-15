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

class DonationType(Enum):
    MONETARY = 'Monetary'
    PHYSICAL = 'Physical'      
