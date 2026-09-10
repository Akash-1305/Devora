import os
from uuid import uuid4
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from database import db
from models import Report, User
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from services.report_service import department_for, generate_report_id, clean_ward
from services.duplicate_service import is_duplicate
from services.flag_service import calculate_flag
from services.assignment_service import assign_worker
from services.location_service import reverse_geocode

reports_bp = Blueprint('reports', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def serialize_report(r):
    return {
        'id': r.id, 'issue_name': r.issue_name, 'category': r.category,
        'location': r.location, 'latitude': r.latitude, 'longitude': r.longitude,
        'ward': r.ward, 'city': r.city, 'department': r.department,
        'status': r.status, 'flag': r.flag, 'image': r.image,
        'image_url': f'/uploads/{r.image}', 'userid': r.userid, 'workerid': r.workerid,
        'created_at': r.created_at.isoformat() if r.created_at else None,
        'assigned_at': r.assigned_at.isoformat() if r.assigned_at else None,
        'started_at': r.started_at.isoformat() if r.started_at else None,
        'completed_at': r.completed_at.isoformat() if r.completed_at else None,
        'verified_at': r.verified_at.isoformat() if r.verified_at else None,
        'dc_approved_at': r.dc_approved_at.isoformat() if r.dc_approved_at else None,
        'worker_completion_latitude': r.worker_completion_latitude,
        'worker_completion_longitude': r.worker_completion_longitude,
        'worker_rating': r.worker.rating if r.worker else None
    }

@reports_bp.post('/api/reports')
def create_report():
    issue = request.form.get('issue_name')
    mapping = department_for(issue)
    if not mapping: 
        return jsonify({'error': 'Invalid problem type.'}), 400
    userid = request.form.get('userid')
    if not User.query.get(userid): 
        return jsonify({'error': 'Invalid user.'}), 400
    image = request.files.get('image')
    if not image or not image.filename: 
        return jsonify({'error': 'Problem image is required.'}), 400
    if not allowed_file(image.filename): 
        return jsonify({'error': 'Only JPG, JPEG and PNG images are allowed.'}), 400
    try:
        lat, lon = float(request.form.get('latitude')), float(request.form.get('longitude'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Valid location coordinates are required.'}), 400
    duplicate = is_duplicate(issue, lat, lon)
    if duplicate:
        return jsonify({'duplicate': True, 'error': 'This issue has already been registered at this location.', 'existing_report_id': duplicate.id}), 409
    department, dep_code = mapping
    ward = clean_ward(request.form.get('ward') or '01')
    city = request.form.get('city') or 'Mysuru'
    location = request.form.get('location') or f'{lat}, {lon}'
    filename = secure_filename(image.filename)
    ext = filename.rsplit('.',1)[1].lower()
    saved_name = f'{uuid4().hex}.{ext}'
    image.save(os.path.join(UPLOAD_FOLDER, saved_name))
    flag = calculate_flag(issue, lat, lon)
    try: report_id = generate_report_id(ward, dep_code)
    except ValueError as e: 
        return jsonify({'error': str(e)}), 400
    report = Report(id=report_id, issue_name=issue, category=issue, location=location,
                    latitude=lat, longitude=lon, ward=ward, city=city, department=department,
                    status='Registered', flag=flag, image=saved_name, userid=userid)
    db.session.add(report); db.session.flush()
    worker = assign_worker(report)
    db.session.commit()
    return jsonify({'message':'Report registered successfully.','report':serialize_report(report),
                    'worker': worker.workerid if worker else None,
                    'assignment_message': None if worker else 'No worker is currently available. Your issue will be assigned when a worker becomes available.'}), 201

@reports_bp.get('/api/reports')
def all_reports():
    return jsonify([serialize_report(r) for r in Report.query.order_by(Report.created_at.desc()).all()])

@reports_bp.get('/api/reports/<report_id>')
def one_report(report_id):
    r = Report.query.get(report_id)
    if not r: return jsonify({'error':'Invalid report ID.'}), 404
    return jsonify(serialize_report(r))

@reports_bp.get('/api/reports/user/<userid>')
def user_reports(userid):
    return jsonify([serialize_report(r) for r in Report.query.filter_by(userid=userid).order_by(Report.created_at.desc()).all()])

@reports_bp.get('/api/location/reverse')
def reverse_location():
    try: lat, lon = float(request.args['lat']), float(request.args['lon'])
    except Exception: 
        return jsonify({'error':'Latitude and longitude are required.'}), 400
    return jsonify(reverse_geocode(lat, lon))

@reports_bp.get('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
