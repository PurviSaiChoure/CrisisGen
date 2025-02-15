from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import logging
from functools import lru_cache
from time import time

app = Flask(__name__)
CORS(app)

# ReliefWeb API Configuration
RELIEFWEB_API_URL = "https://api.reliefweb.int/v1/disasters"
APP_NAME = "disaster-response-dashboard"  # Replace with your app name

def fetch_active_disasters():
    """Fetch active disasters from ReliefWeb API"""
    try:
        params = {
            "appname": APP_NAME,
            "limit": 100,
            "fields[include][]": [
                "name",
                "description",
                "country.name",
                "type.name",
                "status",
                "date.created",
                "primary_country.name"
            ],
            "preset": "latest",
            "profile": "full",
            "status[]": ["alert", "ongoing"]
        }
        
        headers = {
            'Accept': 'application/json'
        }

        response = requests.get(
            RELIEFWEB_API_URL, 
            params=params,
            headers=headers
        )
        
        if response.status_code != 200:
            logging.error(f"API Response: {response.text}")
            response.raise_for_status()
            
        return response.json()
    except Exception as e:
        logging.error(f"Error fetching disasters: {str(e)}")
        return {"data": []}  # Return empty data instead of raising

@app.route('/api/dashboard/map-data', methods=['GET'])
def get_map_data():
    """Get disaster locations for map"""
    try:
        disasters = fetch_active_disasters()
        map_features = []
        
        for disaster in disasters.get('data', []):
            fields = disaster.get('fields', {})
            # Since we don't have direct geometry, we'll create points based on random coordinates
            # In a real app, you'd want to use geocoding or actual coordinates
            map_features.append({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        float(hash(fields.get('name', '')) % 360 - 180),  # longitude between -180 and 180
                        float(hash(fields.get('name', '')) % 180 - 90)   # latitude between -90 and 90
                    ]
                },
                'properties': {
                    'name': fields.get('name', ''),
                    'type': fields.get('type', [{}])[0].get('name', ''),
                    'status': fields.get('status', ''),
                    'country': fields.get('country', [{}])[0].get('name', '')
                }
            })
        
        return jsonify({
            'type': 'FeatureCollection',
            'features': map_features
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        disasters = fetch_active_disasters()

        # Calculate statistics
        total_active = len(disasters.get('data', []))
        disaster_types = {}
        affected_countries = set()

        for disaster in disasters.get('data', []):
            # Count disaster types
            disaster_type = disaster['fields'].get('type', [{}])[0].get('name', 'Unknown')
            disaster_types[disaster_type] = disaster_types.get(disaster_type, 0) + 1

            # Count affected countries
            for country in disaster['fields'].get('country', []):
                affected_countries.add(country.get('name', ''))

        # Return the statistics in the format expected by the frontend
        return jsonify({
            'quick_stats': {
                'active_disasters': {
                    'value': total_active,
                    'change': '+2',  # Simulated change (can be calculated dynamically)
                    'trend': 'up'
                },
                'response_teams': {
                    'value': len(affected_countries) * 3,  # Simulated value
                    'change': '+5',
                    'trend': 'up'
                },
                'avg_response_time': {
                    'value': '8.5m',  # Simulated value
                    'change': '-2.3',
                    'trend': 'down'
                },
                'resources_deployed': {
                    'value': f"{total_active * 100}",  # Simulated value
                    'change': '+123',
                    'trend': 'up'
                }
            },
            'disaster_types': [
                {'type': k, 'count': v}
                for k, v in disaster_types.items()
            ],
            'affected_regions': [
                {'region': country, 'count': 1}
                for country in affected_countries
            ]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/recent-alerts', methods=['GET'])
def get_recent_alerts():
    """Get recent alerts and updates"""
    try:
        disasters = fetch_active_disasters()
        alerts = []

        # Transform the data into the format expected by the frontend
        for disaster in disasters.get('data', [])[:5]:  # Get 5 most recent
            alerts.append({
                'title': disaster['fields'].get('name', ''),
                'location': disaster['fields'].get('country', [{}])[0].get('name', ''),
                'type': 'Critical' if disaster['fields'].get('status') == 'alert' else 'Update',
                'time': disaster['fields'].get('date', {}).get('created', '')
            })

        return jsonify({'alerts': alerts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/activity', methods=['GET'])
def get_activity_data():
    """Get response activity data for the last 7 days"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        # Generate sample activity data (replace with real data in production)
        activity_data = []
        current_date = start_date
        
        while current_date <= end_date:
            # Simulate some activity data
            activity_data.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'responses': int(hash(current_date.strftime('%Y-%m-%d')) % 50 + 20),  # Random number between 20-70
                'alerts': int(hash(current_date.strftime('%Y-%m-%d')) % 30 + 10)      # Random number between 10-40
            })
            current_date += timedelta(days=1)
        
        return jsonify({
            'activity': activity_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Cache the dashboard data for 1 hour
@lru_cache(maxsize=1)
def get_cached_dashboard_data():
    return {
        'map_data': fetch_active_disasters(),
        'timestamp': int(time() / 3600)  # Changes every hour instead of every 5 minutes
    }

if __name__ == '__main__':
    app.run(port=5002, debug=True)