from math import radians, sin, cos, sqrt, atan2

def distance_meters(lat1, lon1, lat2, lon2):
    r = 6371000
    p1,p2 = radians(lat1),radians(lat2)
    dp = radians(lat1 - lat2)
    dl = radians(lon2 - lon1)
    a = sin(dp/2)**2 + cos(p1) * sin(dl/2)**2
    return 2 * r * atan2(sqrt(a),sqrt(1-a))