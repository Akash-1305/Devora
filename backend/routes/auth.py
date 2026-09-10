from flask import Blueprint, request, jsonify
from database import db
from models import User, Worker, Admin

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.post('/register')
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    password = data.get('password') or ''
    if not name or not password:
        return jsonify({'error': 'Name and password are required.'}), 400
    last = User.query.order_by(User.created_at.desc()).first()
    next_no = 1
    if last and last.userid.startswith('U'):
        try: next_no = int(last.userid[1:]) + 1
        except ValueError: pass
    userid = f'U{next_no:04d}'
    while User.query.get(userid):
        next_no += 1
        userid = f'U{next_no:04d}'
    user = User(userid=userid, name=name, password=password)
    db.session.add(user); db.session.commit()
    return jsonify({'message': 'Registration successful.', 'userid': userid}), 201
@auth_bp.post('/login')
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(userid = data.get('userid'), password = data.get('password')).first()
    if not user:
        return jsonify({'error':'Invalid user ID or password.'}), 401
    return jsonify({'role':'user', 'userid':user.userid, 'name':user.name})

@auth_bp.post('/worker-login')
def worker_login():
    data = request.get_json() or {}
    worker = Worker.query.filter_by(workerid = data.get('workerid'), password = data.get('password')).first()
    if not worker:
        return jsonify ({'error':'Invalid worker ID or password.'}), 401
    return jsonify({'role':'worker', 'worker_id': worker.workerid, 'department':worker.department, 'rating':worker.rating})

@auth_bp.post('/admin-login')
def admin_login():
    data = request.get_json() or {}
    admin = Admin.query.filter_by(id = data.get('id'), password = data.get('password')).first()
    if not admin:
        return jsonify({'error':'Invalid admin ID or password.'}), 401
    return jsonify({'role':'admin', 'id':admin.id, 'name': admin.name, 'designation':admin.designation})

