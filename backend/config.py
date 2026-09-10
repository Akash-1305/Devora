import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "civic_issues.db")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
DUPLICATE_DISTANCE_METERS = 50
FLAG_HISTORY_DAYS = 7
FLAG_DISTANCE_METERS = 50
NEARBY_NOTIFICATION_DISTANCE = 100
CITY_CODE = "09"
PRIMARY_CITY = "Mysuru"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
