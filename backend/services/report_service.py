from datetime import datetime
from models import Report 
from config import CITY_CODE

DEPARTMENT_MAP = {
    'Streetlight Failure': ('EEE', '01'),
    'Drain Block': ('UGD', '02'),
    'Pipe Leak': ('UGD', '02')
}

def clean_ward(ward):
    digits = ''.join(ch for ch in str(ward) if ch.isdigit())
    number = int(digits[-2:]) if digits else 1
    return f'{max(1,min(number, 99)):02d}'

def generate_report_id(ward, department_code):
    ward_code = clean_ward(ward)
    date_code = datetime.now().strftime('%d%m%Y')
    prefix = f'{CITY_CODE}{date_code}{ward_code}{department_code}'
    existing = Report.query.filter(Report.id.like(prefix + '%')).count()
    for number in range(existing + 1, 100):
        if not Report.query.get(report_id):
            return report_id
    raise ValueError('Daily. report registration limit reached for this ward/department.')