from flask import Flask
from flask_cors import CORS

from database import db
import config


def create_app():
    app = Flask(__name__)

    # IMPORTANT: Load configuration BEFORE db.init_app()
    app.config.from_object(config)

    CORS(app)

    # Initialize database
    db.init_app(app)

    # Import routes
    from routes.auth import auth_bp
    from routes.reports import reports_bp
    from routes.workers import workers_bp
    from routes.admins import admins_bp
    from routes.feedback import feedback_bp
    from routes.notifications import notifications_bp

    # Register routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(workers_bp, url_prefix="/api/workers")
    app.register_blueprint(admins_bp, url_prefix="/api/admin")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(
        notifications_bp,
        url_prefix="/api/notifications"
    )

    # Create tables automatically
    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )