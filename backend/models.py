from datetime import datetime
from database import db 

class User(db.Model):
    __tablename__ = 'users'
    userid = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DataTime, default=datetime.utcnow)
    reports = db.relationship('Report',backref='user',lazy=True)

class Worker(db.Model):
    __tablename__= 'workers'
    Workerid = db.Column(db.String(20), primary_key=True)
    department = db.Column(db.String(10, nullable=False))
    rating = db.Column(db.Float, default=5.0)
    status = db.Column(db.String(20), default='Available')
    active_works = db.Column()