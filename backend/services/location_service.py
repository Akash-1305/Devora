import requests
from config import NOMINATIM_URL, PRIMARY_CITY

def reverse_geocode(latitude, longitude):
    fallback = {
        'location': f'{latitude:.6f}, {longitude:.6f}',
        'ward': '',
        'city': PRIMARY_CITY
    }
    try:
        response = requests.get(
            NOMINATIM_URL,
            params={'lat': latitude, 'lon': longitude, 'format': 'jsonv2'},
            headers={'User-Agent':'JanSeva-Academic-Project/1.0'},
            timeout=5
        )

        response.raise_for_status()
        data = response.json()
        address = data.get('address', {})
        city = address.get('city') or address.get('town') or address.get('municipality') or PRIMARY_CITY
        ward = address.get('city_district') or address.get('suburb') or address.get('neighbourhood') or ''
        return {
            'location': data.get('display_name') or fallback['location'],
            'ward': ward,
            'city': city
        }
    except Exception:
        return fallback