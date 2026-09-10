from datetime import datetime
from flask import Blueprint, request, jsonify
from database import database
from models import Worker, Report
from routes.reports import serialize_report
from services.assignment_service import assign_pending_reports

workers_bp = Blueprint('workers', __name__)

@workers_bp.get('/api/worksers/<workerid>')
def worker_detail(workerid):
    w = Worker.query.get(workerid)
    if not w:
        return jsonify({'error':'Worker not found.'}), 404
        completed = Report.query.filter_by(workerid = workerid, status = 'Closed').count()
        return jsonify({'workerid':w.workerid, 'department':w.department, 'rating':round(w.rating, 2), 'status':w.status, 'active_works':w.active_works, 'completed_works':completed})

@workers_bp.put('/api/workers/<workerid>/status')
def worker_status(workerid):
    w = Worker.query.get(workerid)
    if not w:
        return jsonify({'error':'Worker not found.'}), 404
    status = (request.get_json() or {}).get('status')

    if status not in {'Available':'Unavailable'}:
        return jsonify({'error':'Invalid worker status.'}), 400
    
    w.status = status; db.session.commit()

    assigned = assign_pending_reports(w.department) if status == 'Available' else 0
    return jsonify({'message':'Availability updated', 'assigned_pending':assigned})

@workers_bp.get('/api/workers/<workerid>/works')
def worker_works(workerid):
    if not Worker.query.get(workerid):
        return jsonify({'error':'Worker not found.'}), 404
        works = Report.query.filter_by(workerid = workerid).order_by(Report.created_at.desc()).all()
        return jsonify([serialize_report(r) for r in works])

@workers_bp.put('/api/reports/<report_id>/start')
def start_work(report_id):
    r = Report.query.get(report_id); data = request.get_json() or {}
    if not r:
        return jsonify({'error':'Invalid report ID.'}), 404
    if r.workerid != data.get('workerid'):
        return jsonify({'error':'Unauthorized Action.'}), 403
    if r.status != 'Assigned':
        return jsonify({'error':'Only assigned work can be started.'}), 400

    r.status = 'In Progress'; r.started_at = datetime.utcnow();
    db.session.commit()

    return jsonify({'message':'Work started', 'report': serialize_report(r)})

@worker_bp.put('/api/reports/<report_id>/complete')
def complete_work(report_id):
    r = Report.query.get(report_id); data = request.get_json() or {}
    if not r:
        return jsonify({'error':'Invalid report ID.'}), 404
    
    if r.workerid != data.get('workerid'):
        return jsonify({'error':'Unauthorized action.'}), 403

    if r.status != 'In Progress':
        return jsonify({'error':'Only work in progress can be completed.'}), 400
    
    r.status = 'Completed'; r.completed_at = datetime.utcnow()
    r.worker_completion_latitude = data.get('latitude'); r.worker_completion_longitude = data.get('longitude')

    if r.worker: r.worker.active_works = max(0, r.worker.active_works - 1)
    db.session.commit()
    return jsonify({'message':'Work marked completed and sent for admin verification.', 'report': serialize_report(r)})

    