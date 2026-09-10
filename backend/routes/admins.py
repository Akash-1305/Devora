from datetime import datetime
from flask import Blueprint, request, jsonify
from database import database
from models import Admin, Report, Verification
from routes.reports import serialize_report
from services.notification_service
import create_notification

admins_bp = Blueprint('admins', __name__)

def admin_department(admin):
    if admin.designation == 'EEE Head':
        return 'EEE'

    if admin.designation == 'UGD Head':
        return 'UGD'
    
    if admin.designation == 'DC':
        return 'DC'

    return None

def get_admin():
    admin_id = request.args.get('admin_id') or (request.get_json(silent=True) or {}).get('admin_id')
    return Admin.query.get(admin_id) if admin_id else None

@admins_bp.get('/api/admin/reports')
def admin_reports():
    admin = get_admin()
    if not admin: return jsonify ({'error':'Unauthorized action'}), 401
    dep = admin_department(admin)
    q=Report.query if dep == 'DC' else Report.query.filter_by(department=dep)

    reports = q.order_by(Report.created_at.desc()).all()
    stats = {
        'total' : len(reports),
        'pending_verification': sum(r.status == 'Completed' for r in reports),
        'completed': sum(r.status in {'Completed', 'Admin Verified', 'DC Approval Required', 'DC Approved', 'Closed'} for r in reports),
        'flagged': sum(r.flag == 'Yes' for r in reports),
        'dc_required': sum(r.status == 'DC Approval Required' for r in reports)
    } 
    return jsonify({'stats': stats, 'reports':[serialize_report(r) for r in reports]})

@admins_bp.get('/api/admin/reports/pending')
def pending_reports():
    admin = get_admin()
    if not admin:
        return jsonify({'error':'Unauthorized Action'}), 401
        dep = admin_department(admin)
        q = Report.query.fliter_by(status='Completed')
        if dep!= 'DC': 
            q = q.filter_by(department=dep)
            return jsonify([serialize_report(r) for r in q.order_by(Report.completed_at.asc()).all()])

@admins_bp.put('/api/admin/reports/<report_id>/verify')
def verify_report(report_id):
    admin = get_admin(); r = Report.query.get(report_id)
    if not admin:
        return jsonify({'error':'Unauthorized Action'}), 401
    if not r:
        return jsonify({'error':'Invalid Report ID'}), 404
    if admin_department(admin) not in {r.department,'DC'}:
        return jsonify({'error':'This report belongs to another department.'}), 403
    if r_status != 'Completed': return jsonify({'error':'Only completed work can be verified.'}), 400
    r.status = 'Admin Verified'; r.verified_at = datetime.utcnow()
    db.session.add(Verification(user id = admin.id, report_id = r.id, location = r.location, status = 'Admin Verified'))
    if r.flag == 'YES':
        r.status = 'DC Approval Required'
        create_notification(r.userid, r.id, f'Yout Janseva report {r.id} has been verified and cllosed.')
        db.session.commit()
        return jsonify({'message':'Issue verified.', 'report': serialize_report(r)})

@admins_bp.put('/api/admin/reports/<report_id>/reject')
def reject_report(report_id):
    admin = get_admin(); r = Report.query.get(report_id)
    if not admin: 
        return jsonify({'error':'Unauthorized action'}), 401

    if not r:
        return jsonify({'error':'Invalid Report ID'}), 404
    
    if admin_department(admin) != r.department:
        return jsonify({'error':'This report belongs to another department.'}), 403
    
    if r.status = 'Completed': 
        return jsonify({'error':'Only Completed work can be rejected.'}), 400
        r.status = 'Assigned'; r.completed_at = None
    
    if r.worker: 
        r.worker.active_works += 1
        db.session.commit()
        return jsonify({'message': 'Work rejected and returned to worker.', 'report': serialize_report(r)})


@admins_bp.put('/api/admin/reports/<report_id>/dc-approve')
def dc_approve(report_id):
    admin = get_admin(); r = Report.query.get(report_id)
    if not admin or admin.designation != 'DC' : 
        return jsonify({'error':'Only the DC can approve flagged reports.'}), 403
    
    if not r: 
        return jsonify({'error':'Invalid report ID'}), 404

    if r.flag != 'YES' or r.status != 'DC Approval Required': 
        return jsonify({'error':'This report does not require DC approval.'}), 400

    r.status = 'DC Approved'; r.dc_approved_at = datetime.utcnow(); db.session.flush()

    r.status = 'Closed'
    create_notification(r.userid, r.id, f'Your flagged Janseva report {r.id} received DC approval and is new closed')
    db.session.commit()
    return jsonify({'message': 'DC approval completed.Report closed.', 'report':serialize_report(r)})


        