from flask import Blueprint, request, jsonify
from database import db
from models import User

user_bp = Blueprint('user',__name__)

@user_bp.post('/api/auth/register')
def register():
    data = request.get_json() or {}

    name = (data.get('name') or '').strip()
    password = data.get('password') or ''

    if not name or not password:
        return jsonify({'error':'Name and password required.'}), 400
    last = User.query.order_by(User.created_at.desc()).first()

    next_no = 1

    if last and last.userid.startswith('U'):
        try:
            next_no = int(last.userid[1:]) + 1
        except ValueError:
            pass
    userid = f'U{next_no:04d}'

    while db.session.get(User, userid):
        next_no += 1
        userid = f'U{next_no:04d}'

    user = User (
        userid = userid,
        name = name,
        password = password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message':'Registration Successful',
        'userid':userid
    }), 201

@user_bp.post('/api/auth/login')
def login():
    data = request.get_json() or {}

    user = User.query.filter_by(
        userid = data.get('userid'),
        password = data.get('password')
    ).first()

    if not user:
        return jsonify({
            'error':'Invalid user ID or password.'
        }), 401

    return jsonify ({'role':'user', 'userid':user.userid, 'name':user.name})