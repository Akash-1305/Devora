from database import db 
from models import Notification

def create_notification(userid, report_id, message):
    note = Notification(userid=userid, report_id=report_id, message=message)
    db.session.add(note)
    return note