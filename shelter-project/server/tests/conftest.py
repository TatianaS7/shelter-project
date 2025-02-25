import pytest
from flask import Flask
from routes.shelter import shelters, staff, resources, donations
from routes.user import users, user_donations
from routes.reports import reports
from connection import db


# Create a fixture to set up the Flask app for testing
@pytest.fixture
def app():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    # app.register_blueprint(shelters, url_prefix='/api/shelters')
    # app.register_blueprint(staff, url_prefix='/api/shelters')
    # app.register_blueprint(resources, url_prefix='/api/shelters')
    # app.register_blueprint(donations, url_prefix='/api/shelters')
    app.register_blueprint(users, url_prefix='/api/users')
    app.register_blueprint(user_donations, url_prefix='/api/users')
    # app.register_blueprint(reports, url_prefix='/api/reports')

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
