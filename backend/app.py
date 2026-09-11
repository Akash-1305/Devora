import os

from flask import Flask, jsonify
from flask_cors import CORS

from database import db
import config

from routes.auth import auth_bp
from routes.reports import reports_bp
from routes.workers import workers_bp
from routes.admins import admins_bp
from routes.feedback import feedback_bp
from routes.notifications import notifications_bp
from routes.verification import verification_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(config)

    CORS(app)
    db.init_app(app)

    os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)

    app.register_blueprint(auth_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(workers_bp)
    app.register_blueprint(admins_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(verification_bp)

    @app.get("/")
    def home():
        return jsonify({
            "status": "success",
            "app": "JanSeva",
            "message": "JanSeva Backend API is running"
        })

    @app.get("/api/health")
    def health():
        return jsonify({
            "status": "ok",
            "app": "JanSeva"
        })

    @app.errorhandler(413)
    def too_large(_):
        return jsonify({
            "error": "Image is too large. Maximum size is 5 MB."
        }), 413

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({
            "error": "API endpoint not found."
        }), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({
            "error": "Internal server error."
        }), 500

    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5002
    )