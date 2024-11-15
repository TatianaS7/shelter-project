from flask_cors import CORS
from flask import Flask, request, jsonify
from connection import db
from seed_data import seed_all

def create_app():
    app = Flask(__name__, static_folder='client')
    CORS(app)

    # Configure the database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shelter.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    
    # Import routes
    from routes.shelter import shelters

    # Register the routes
    app.register_blueprint(shelters, url_prefix='/shelters')

    with app.app_context():
        db.drop_all()
        db.create_all()
        # Seed data
        seed_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)