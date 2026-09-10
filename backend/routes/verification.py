from flask import Blueprint, jsonify
from models import Verification

verification_bp = Blueprint('verification', __name__)

@verification_bp.get('/api/verification/<report_id>')
def verification_history(report_id):
    rows=Verification.query.filter_by(report_id=report_id).order_by(Verification.verified_at.desc()).all()
    return jsonify([{'id':v.id,'userid':v.userid,'location':v.location,'status':v.status,'verified_at':v.verified_at.isoformat()} for v in rows])
