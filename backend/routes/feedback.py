from flask import Blueprint, request, jsonify
from sqlalchemy import func
from database import db
from models import Feedback, Report, Worker

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.post('/api/feedback')
def add_feedback():
    data=request.get_json() or {}
    r=Report.query.get(data.get('report_id'))
    if not r or r.status!='Closed': return jsonify({'error':'Feedback is allowed only for closed reports.'}), 400
    if not r.workerid: return jsonify({'error':'No worker is associated with this report.'}), 400
    if Feedback.query.filter_by(userid=data.get('userid'),report_id=r.id).first(): return jsonify({'error':'Feedback already submitted for this report.'}), 409
    try: rating=int(data.get('rating'))
    except Exception: return jsonify({'error':'Rating must be between 1 and 5.'}), 400
    if rating not in range(1,6): return jsonify({'error':'Rating must be between 1 and 5.'}), 400
    f=Feedback(userid=data.get('userid'),report_id=r.id,workerid=r.workerid,rating=rating,comment=data.get('comment',''))
    db.session.add(f); db.session.flush()
    avg=db.session.query(func.avg(Feedback.rating)).filter_by(workerid=r.workerid).scalar()
    worker=Worker.query.get(r.workerid); worker.rating=float(avg or worker.rating)
    db.session.commit()
    return jsonify({'message':'Thank you for your feedback.','worker_rating':round(worker.rating,2)}),201

@feedback_bp.get('/api/feedback/report/<report_id>')
def report_feedback(report_id):
    rows=Feedback.query.filter_by(report_id=report_id).all()
    return jsonify([{'id':f.id,'userid':f.userid,'workerid':f.workerid,'rating':f.rating,'comment':f.comment,'created_at':f.created_at.isoformat()} for f in rows])
