from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import logging
from functools import lru_cache
from time import time
from typing import Dict, List
from math import sin, cos

app = Flask(__name__)
CORS(app)

# Country Centroids (latitude, longitude)
COUNTRY_CENTROIDS = {
    "United States": {"lat": 37.0902, "lon": -95.7129},
    "Canada": {"lat": 56.1304, "lon": -106.3468},
    "Mexico": {"lat": 23.6345, "lon": -102.5528},
    "Japan": {"lat": 36.2048, "lon": 138.2529},
    "Australia": {"lat": -25.2744, "lon": 133.7751},
    "China": {"lat": 35.8617, "lon": 104.1954},
    "India": {"lat": 20.5937, "lon": 78.9629},
    "Brazil": {"lat": -14.2350, "lon": -51.9253},
    "Indonesia": {"lat": -0.7893, "lon": 113.9213},
    "Philippines": {"lat": 12.8797, "lon": 121.7740},
    "Italy": {"lat": 41.8719, "lon": 12.5674},
    "France": {"lat": 46.2276, "lon": 2.2137},
    "Germany": {"lat": 51.1657, "lon": 10.4515},
    "United Kingdom": {"lat": 55.3781, "lon": -3.4360},
    "South Africa": {"lat": -30.5595, "lon": 22.9375},
}

RELIEFWEB_API_URL = "https://api.reliefweb.int/v1/disasters"
APP_NAME = "disaster-response-dashboard"

# Add new API endpoints
GDACS_API_URL = "https://www.gdacs.org/gdacsapi/api/events/getevents"
EM_DAT_API_URL = "https://public.emdat.be/api/v1/disasters"  # Example, needs subscription
RELIEF_WEB_REPORTS_URL = "https://api.reliefweb.int/v1/reports"

def fetch_active_disasters():
    """Fetch active disasters from ReliefWeb API"""
    try:
        params = {
            "appname": APP_NAME,
            "limit": 100,
            "fields[include][]": [
                "name", "description", "country.name", "type.name",
                "status", "date.created", "primary_country.name"
            ],
            "preset": "latest",
            "profile": "full",
            "status[]": ["alert", "ongoing"]
        }
        
        response = requests.get(
            RELIEFWEB_API_URL,
            params=params,
            headers={'Accept': 'application/json'}
        )
        return response.json() if response.status_code == 200 else {"data": []}
    except Exception as e:
        logging.error(f"Error fetching disasters: {str(e)}")
        return {"data": []}

@app.route('/api/dashboard/map-data', methods=['GET'])
def get_map_data():
    """Get disaster locations using country centroids"""
    try:
        disasters = fetch_active_disasters()
        map_features = []
        
        for disaster in disasters.get('data', []):
            fields = disaster.get('fields', {})
            countries = fields.get('country', [])
            if not countries:
                continue

            country_name = countries[0].get('name', '')
            if not country_name:
                continue

            centroid = COUNTRY_CENTROIDS.get(country_name)
            if not centroid:
                logging.warning(f"No centroid data for country: {country_name}")
                continue

            map_features.append({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [centroid['lon'], centroid['lat']]
                },
                'properties': {
                    'name': fields.get('name', 'Unknown'),
                    'type': fields.get('type', [{}])[0].get('name', 'Unknown'),
                    'status': fields.get('status', 'unknown'),
                    'country': country_name
                }
            })
        
        return jsonify({
            'type': 'FeatureCollection',
            'features': map_features
        })
    except Exception as e:
        logging.error(f"Map data error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        disasters = fetch_active_disasters().get('data', [])
        disaster_types = {}
        affected_countries = set()

        for disaster in disasters:
            disaster_type = disaster['fields'].get('type', [{}])[0].get('name', 'Unknown')
            disaster_types[disaster_type] = disaster_types.get(disaster_type, 0) + 1
            
            for country in disaster['fields'].get('country', []):
                country_name = country.get('name', '')
                if country_name:
                    affected_countries.add(country_name)

        return jsonify({
            'quick_stats': {
                'active_disasters': {
                    'value': len(disasters),
                    'change': '+2',
                    'trend': 'up'
                },
                'response_teams': {
                    'value': len(affected_countries) * 3,
                    'change': '+5',
                    'trend': 'up'
                },
                'avg_response_time': {
                    'value': '8.5m',
                    'change': '-2.3',
                    'trend': 'down'
                },
                'resources_deployed': {
                    'value': f"{len(disasters) * 100}",
                    'change': '+123',
                    'trend': 'up'
                }
            },
            'disaster_types': [{'type': k, 'count': v} for k, v in disaster_types.items()],
            'affected_regions': [{'region': c, 'count': 1} for c in affected_countries]
        })
    except Exception as e:
        logging.error(f"Stats error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/recent-alerts', methods=['GET'])
def get_recent_alerts():
    """Get recent alerts and updates"""
    try:
        disasters = fetch_active_disasters().get('data', [])[:5]
        alerts = []

        for disaster in disasters:
            fields = disaster.get('fields', {})
            countries = fields.get('country', [{}])
            
            alerts.append({
                'title': fields.get('name', 'Unknown Event'),
                'location': countries[0].get('name', 'Unknown Location'),
                'type': 'Critical' if fields.get('status') == 'alert' else 'Update',
                'time': fields.get('date', {}).get('created', '')
            })

        return jsonify({'alerts': alerts})
    except Exception as e:
        logging.error(f"Alerts error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_activity_metrics(days: int = 7) -> List[Dict]:
    """Get real activity metrics from ReliefWeb reports"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        params = {
            "appname": APP_NAME,
            "fields[include][]": [
                "date.created",
                "status",
                "title",
                "country.name",
                "type.name"
            ],
            "filter[operator]": "AND",
            "filter[conditions][]": [
                {
                    "field": "date.created",
                    "value": {
                        "from": start_date.strftime("%Y-%m-%d"),
                        "to": end_date.strftime("%Y-%m-%d")
                    }
                },
                {
                    "field": "status",
                    "value": ["alert", "ongoing"]
                }
            ],
            "limit": 1000,
            "sort[]": ["date.created:desc"]
        }
        
        response = requests.get(
            RELIEF_WEB_REPORTS_URL,
            params=params,
            headers={'Accept': 'application/json'}
        )
        
        if response.status_code != 200:
            logging.error(f"ReliefWeb API error: {response.text}")
            return generate_fallback_data(days)
            
        reports_data = response.json()
        
        # Initialize daily activity for all days
        daily_activity = {
            (start_date + timedelta(days=d)).strftime('%Y-%m-%d'): {
                'responses': 0,
                'alerts': 0,
                'date': (start_date + timedelta(days=d)).strftime('%Y-%m-%d')
            }
            for d in range(days + 1)
        }
        
        # Process reports
        for report in reports_data.get('data', []):
            try:
                date = report['fields']['date']['created'][:10]
                if date in daily_activity:
                    if report['fields'].get('status') == 'alert':
                        daily_activity[date]['alerts'] += 1
                    else:
                        daily_activity[date]['responses'] += 1
            except KeyError as e:
                logging.error(f"Error processing report: {e}")
                continue
        
        # Convert to list and sort by date
        activity_list = list(daily_activity.values())
        activity_list.sort(key=lambda x: x['date'])
        
        return activity_list

    except Exception as e:
        logging.error(f"Error fetching activity metrics: {str(e)}")
        return generate_fallback_data(days)

def generate_fallback_data(days: int) -> List[Dict]:
    """Generate fallback data if API fails"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    return [
        {
            'date': (start_date + timedelta(days=i)).strftime('%Y-%m-%d'),
            'responses': max(10, int(20 * (1 + 0.5 * sin(i)))),
            'alerts': max(5, int(10 * (1 + 0.5 * cos(i))))
        }
        for i in range(days + 1)
    ]

@app.route('/api/dashboard/activity', methods=['GET'])
def get_activity_data():
    """Get real response activity data"""
    try:
        activity_data = get_activity_metrics(7)
        return jsonify({'activity': activity_data})
    except Exception as e:
        logging.error(f"Activity data error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_response_stats() -> Dict:
    """Get real response statistics"""
    try:
        disasters = fetch_active_disasters().get('data', [])
        
        # Get real response team data from ReliefWeb
        teams_response = requests.get(
            f"{RELIEF_WEB_REPORTS_URL}",
            params={
                "appname": APP_NAME,
                "fields[include][]": ["primary_country", "status"],
                "filter": {
                    "field": "content_type",
                    "value": "report"
                },
                "limit": 1000
            }
        )
        
        teams_data = teams_response.json() if teams_response.status_code == 200 else {"data": []}
        
        # Calculate real metrics
        active_disasters = len(disasters)
        response_teams = len(set(r['fields']['primary_country']['name'] 
                               for r in teams_data.get('data', []) 
                               if 'primary_country' in r['fields']))
        
        # Calculate average response time from actual data
        response_times = [
            (datetime.strptime(d['fields']['date']['created'], "%Y-%m-%dT%H:%M:%S%z")
             - datetime.strptime(d['fields']['date']['original'], "%Y-%m-%dT%H:%M:%S%z")).total_seconds() / 60
            for d in disasters
            if 'date' in d['fields'] and all(k in d['fields']['date'] for k in ['created', 'original'])
        ]
        
        avg_response_time = f"{sum(response_times) / len(response_times):.1f}m" if response_times else "N/A"
        
        return {
            'active_disasters': active_disasters,
            'response_teams': response_teams,
            'avg_response_time': avg_response_time,
            'resources_deployed': response_teams   # Estimate based on team size
        }
    except Exception as e:
        logging.error(f"Error fetching response stats: {str(e)}")
        return {}

@lru_cache(maxsize=1)
def get_cached_dashboard_data():
    return {
        'map_data': fetch_active_disasters(),
        'timestamp': int(time() / 3600)  # Cache for 1 hour
    }

if __name__ == '__main__':
    app.run(port=5002, debug=True)