import pytest
from flask import Flask, json
from models import User
from _types import UserRole, UserType
from connection import db
from routes.user import users


# Create a fixture to set up the Flask app for testing
@pytest.fixture
def app():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(users)

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

# Test 1: Register a User
def test_register_user(client, init_db):
    data = {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'user_type': 'team_member',
        'user_role': 'admin',
        'shelter_id': 1
    }
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201
    assert response.json['first_name'] == 'John'
    assert response.json['last_name'] == 'Doe'
    assert response.json['email'] == 'john.doe@example.com'

# Test 2: Register a User with an existing email
def test_register_user_existing_email(client, init_db):
    user = User(first_name='Jane', last_name='Doe', email='jane.doe@example.com', user_type=UserType.TEAM_MEMBER, user_role=UserRole.ADMIN, shelter_id=1)
    db.session.add(user)
    db.session.commit()
    
    data = {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'jane.doe@example.com',
        'user_type': 'team_member',
        'user_role': 'admin',
        'shelter_id': 1
    }
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400
    assert response.json['error'] == 'User with that email already exists'

# Test 3: Get All Users
def test_get_all_users(client, init_db):
    user1 = User(first_name='John', last_name='Doe', email='john.doe@example.com', user_type=UserType.TEAM_MEMBER, user_role=UserRole.ADMIN, shelter_id=1)
    user2 = User(first_name='Jane', last_name='Doe', email='jane.doe@example.com', user_type=UserType.TEAM_MEMBER, user_role=UserRole.ADMIN, shelter_id=1)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()
    
    response = client.get('/all')
    assert response.status_code == 200
    assert len(response.json) == 2

# Test 4: Get User by ID
def test_get_user_by_id(client, init_db):
    user = User(first_name='John', last_name='Doe', email='john.doe@example.com', user_type=UserType.TEAM_MEMBER, user_role=UserRole.ADMIN, shelter_id=1)
    db.session.add(user)
    db.session.commit()
    
    response = client.get(f'/{user.id}')
    assert response.status_code == 200
    assert response.json['first_name'] == 'John'
    assert response.json['last_name'] == 'Doe'

# Test 5: Get User by ID that does not exist
def test_update_user_by_id(client, init_db):
    user = User(first_name='John', last_name='Doe', email='john.doe@example.com', user_type=UserType.TEAM_MEMBER, user_role=UserRole.ADMIN, shelter_id=1)
    db.session.add(user)
    db.session.commit()
    
    data = {
        'first_name': 'Johnny',
        'last_name': 'Doe',
        'email': 'johnny.doe@example.com'
    }
    response = client.put(f'/{user.id}/update', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 200
    assert response.json['first_name'] == 'Johnny'
    assert response.json['email'] == 'johnny.doe@example.com'