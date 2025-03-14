import pytest
from flask import Flask, json
from models import User, Donation
from _types import UserRole, UserType, DonationType, UnitType, ResourceNeed, DonationStatus
from connection import db
from routes.user import user_donations, users


# Create a fixture to set up the Flask app for testing
@pytest.fixture
def app():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(user_donations)

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def init_db(app):
    db.create_all()
    yield db
    db.session.remove()
    db.drop_all()

# Test 1: Create a donation (Monetary)
def test_create_monetary_donation(client, init_db):
    # Create user 
    user = User(first_name='Jane', last_name='Doe', email='jane.doe@example.com', user_role=None, user_type=UserType.DONOR, shelter_id=1)
    db.session.add(user)
    db.session.commit()

    donation = {
        'user_id': user.id,
        'status': 'Pending',
        'shelter_id': 1,
        'donation_type': 'Monetary',
        'donation_amount': 150.0,
        'donated_items': None,
        'note': None
    }

    response = client.post(f'/{user.id}/donations/new', data=json.dumps(donation), content_type='application/json')    
    assert response.status_code == 201
    assert response.json['donation_amount'] == 150.0
    assert response.json['status'] == 'Pending'

# Test 2: Create a donation (Physical)

# Test 3: Get All Donations
def test_get_all_donations(client, init_db):
    # Create user 
    user = User(first_name='Jane', last_name='Doe', email='jane.doe@example.com', user_role=None, user_type=UserType.DONOR, shelter_id=1)
    db.session.add(user)
    db.session.commit()

    # Create donations
    donation1 = Donation(status=DonationStatus.PENDING, user_id=user.id, shelter_id=1, donation_type=DonationType.MONETARY, donation_amount=150, donated_items=None, note=None)
    donation2 = Donation(status=DonationStatus.PENDING, user_id=user.id, shelter_id=1, donation_type=DonationType.PHYSICAL, donation_amount=None, donated_items=[{"resource_type": ResourceNeed.CLOTHING.value, "unit": UnitType.BAG.value,"quantity": 2}], note=None)    
    db.session.add(donation1)
    db.session.add(donation2)
    db.session.commit()

    response = client.get(f'/{user.id}/donations/all')
    assert response.status_code == 200
    assert len(response.json) == 2
