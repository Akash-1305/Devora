from flask import Blueprint, request, jsonify
from database import db
from models import Notification, Report
from services.geo import distance_meters
from config import NEARBY_NOTIFICATION_DISTANCE

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.get('/api/notifications/<userid>')
def user_notifications(userid):
    notes=Notification.query.filter_by(userid=userid).order_by(Notification.created_at.desc()).all()
    return jsonify([{'id':n.id,'report_id':n.report_id,'message':n.message,'is_read':n.is_read,'created_at':n.created_at.isoformat()} for n in notes])

@notifications_bp.put('/api/notifications/<int:note_id>/read')
def mark_read(note_id):
    n=Notification.query.get(note_id)
    if not n: return jsonify({'error':'Notification not found.'}),404
    n.is_read=True; db.session.commit(); return jsonify({'message':'Notification marked as read.'})

@notifications_bp.get('/api/nearby-solved')
def nearby_solved():
    try: lat=float(request.args['lat']); lon=float(request.args['lon']); userid=request.args['userid']
    except Exception: return jsonify({'error':'userid, lat and lon are required.'}),400
    results=[]
    for r in Report.query.filter_by(status='Closed').order_by(Report.completed_at.desc()).limit(100).all():
        if distance_meters(lat,lon,r.latitude,r.longitude)<=NEARBY_NOTIFICATION_DISTANCE:
            results.append({'report_id':r.id,'issue_name':r.issue_name,'location':r.location,'workerid':r.workerid,
                            'message':'An issue reported near your current location has been solved. Would you like to provide feedback?'})
    return jsonify(results[:5])
