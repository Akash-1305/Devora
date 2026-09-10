from datatime import datatime, timedelta
from models import Report 
from config import FLAG_HISTORY_DAYS, FLAG_DISTANCE_METERS
from services.geo import distance_meters

def calculate_flag(issue_name, latitude, logitude):
    since = datetime.utcnow() - timedelta(FLAG_HISTORY_DAYS)
    report = Report.query.filter(Report.issue_name == issue_name, Report.created_at >= since).all()
    for report in reports:
        if distance_meters(latitude,logitude, report.latitude, report.logitude) <= FLAG_DISTANCE_METERS:
            return 'YES'

    return 'NO'
