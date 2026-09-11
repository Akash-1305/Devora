from datetime import datetime
from database import db 
from models import Worker, Report

def assign_worker(report):
    worker = (Worker.query
    .filter_by(department=report.department, status='Available')
    .order_by(Worker.active_works.asc(),Worker.rating.desc())
    .first())
    if not worker:
        report.status = 'Registered'
        return None
    report.workerid = worker.workerid
    report.status = 'Assigned'
    report.assigned_at = datetime.utcnow()
    worker.active_works += 1
    return worker

def assign_pending_reports(department):
    pending = Report.query.filter_by(department=department, status='Registered',workerid=None).order_by(Report.created_at.asc()).all()
    assigned = 0
    for report in pending:
        worker = assign_worker(report)
        if not worker:
            break
        assigned += 1
    db.session.commit()
    return assigned
