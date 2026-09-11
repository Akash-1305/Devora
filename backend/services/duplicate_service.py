from models import Report
from config import DUPLICATE_DISTANCE_METERS
from services.geo import distance_meters

ACTIVE_DUPLICATE_STATUES = {'Registered','Assigned','In Progress','Completed'}

def is_duplicate(issue_name, latitude, longitude):
    reports = Report.query.filter_by(issue_name=issue_name).all()
    for report in reports:
        if report.status not in ACTIVE_DUPLICATE_STATUES:
            continue
        if distance_meters(latitude, longitude, report.latitude, report.longitude) <= DUPLICATE_DISTANCE_METERS:
            return report
    return None

    