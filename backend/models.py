from datetime import datetime
from database import db

class User(db.Model):
    __tablename__ = 'users'
    userid = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reports = db.relationship('Report', backref='user', lazy=True)

class Worker(db.Model):
    __tablename__ = 'workers'
    workerid = db.Column(db.String(20), primary_key=True)
    department = db.Column(db.String(10), nullable=False)
    rating = db.Column(db.Float, default=5.0)
    status = db.Column(db.String(20), default='Available')
    active_works = db.Column(db.Integer, default=0)
    password = db.Column(db.String(100), nullable=False)
    reports = db.relationship('Report', backref='worker', lazy=True)

class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.String(30), primary_key=True)
    issue_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    ward = db.Column(db.String(10), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(30), default='Registered')
    flag = db.Column(db.String(3), default='NO')
    image = db.Column(db.String(255), nullable=False)
    userid = db.Column(db.String(20), db.ForeignKey('users.userid'), nullable=False)
    workerid = db.Column(db.String(20), db.ForeignKey('workers.workerid'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    assigned_at = db.Column(db.DateTime)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    verified_at = db.Column(db.DateTime)
    dc_approved_at = db.Column(db.DateTime)
    worker_completion_latitude = db.Column(db.Float)
    worker_completion_longitude = db.Column(db.Float)

class Verification(db.Model):
    __tablename__ = 'verification'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.String(20), nullable=False)
    report_id = db.Column(db.String(30), db.ForeignKey('reports.id'), nullable=False)
    location = db.Column(db.String(255))
    status = db.Column(db.String(30), nullable=False)
    verified_at = db.Column(db.DateTime, default=datetime.utcnow)

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.String(20), db.ForeignKey('users.userid'), nullable=False)
    report_id = db.Column(db.String(30), db.ForeignKey('reports.id'), nullable=False)
    workerid = db.Column(db.String(20), db.ForeignKey('workers.workerid'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (db.UniqueConstraint('userid', 'report_id', name='unique_user_report_feedback'),)

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.String(20), db.ForeignKey('users.userid'), nullable=False)
    report_id = db.Column(db.String(30), db.ForeignKey('reports.id'))
    message = db.Column(db.String(500), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
