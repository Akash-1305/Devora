from datetime import datetime, timedelta
from models import Report
from config import FLAG_HISTORY_DAYS, FLAG_DISTANCE_METERS
from services.geo import distance_meters

def calculate_flag(issue_name, latitude, longitude):
    since = datetime.utcnow() - timedelta(days=FLAG_HISTORY_DAYS)
    reports = Report.query.filter(Report.issue_name == issue_name, Report.created_at >= since).all()
    for report in reports:
        if distance_meters(latitude, longitude, report.latitude, report.longitude) <= FLAG_DISTANCE_METERS:
            return 'YES'
    return 'NO'
