from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta, timezone
import logging

app = Flask(__name__)
CORS(app)

# ReliefWeb API Configuration
RELIEFWEB_API_URL = "https://api.reliefweb.int/v1/disasters"
APP_NAME = "disaster-response-app"

def fetch_disaster_data():
    """Fetch disaster data from ReliefWeb API"""
    try:
        params = {
            "appname": APP_NAME,
            "limit": 100,
            "fields[include][]": [
                "date",
                "status",
                "type",
                "country",
                "primary_country",
                "description",
                "name"
            ],
            "sort[]": ["date:desc"]
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

        data = response.json()
        print("API Response Data:", data)  # Debug log
        disasters = data.get('data', [])

        
        # Process the data
        processed_data = {
            'monthly_trends': process_monthly_trends(disasters),
            'type_distribution': process_type_distribution(disasters),
            'regional_data': process_regional_data(disasters)
        }

        quick_stats = {
            'active_disasters': calculate_active_disasters(disasters),
            'people_affected': {'value': len(disasters), 'change': 0, 'trend': 'stable'},
            'avg_response_time': {'value': 0, 'change': 0, 'trend': 'stable'}
        }

        return {
            'disaster_data': processed_data,
            'quick_stats': quick_stats
        }

    except Exception as e:
        logging.error(f"Error fetching data: {str(e)}")
        raise

def process_monthly_trends(disasters):
    """Process disasters into monthly trends"""
    trends = []
    for i in range(12):
        month = datetime.now(timezone.utc) - timedelta(days=30*i)
        month_str = month.strftime("%Y-%m")
        month_disasters = [
            d for d in disasters 
            if d['fields'].get('date', {}).get('created', '').startswith(month_str)
        ]
        trends.append({
            'month': month.strftime("%B %Y"),
            'count': len(month_disasters)
        })
    return trends

def process_type_distribution(disasters):
    """Process disasters by type"""
    type_counts = {}
    for disaster in disasters:
        disaster_type = disaster['fields'].get('type', [{}])[0].get('name', 'Unknown')
        type_counts[disaster_type] = type_counts.get(disaster_type, 0) + 1
    return [{'type': k, 'count': v} for k, v in type_counts.items()]

def process_regional_data(disasters):
    """Process disasters by region"""
    region_counts = {}
    for disaster in disasters:
        country = disaster['fields'].get('country', [{}])[0].get('name', 'Unknown')
        region_counts[country] = region_counts.get(country, 0) + 1
    return [{'region': k, 'disasters': v} for k, v in region_counts.items()]

def calculate_active_disasters(disasters):
    """Calculate active disasters"""
    current_disasters = [d for d in disasters if d['fields'].get('status') == 'current']
    current_count = len(current_disasters)

    # Use timezone-aware datetime
    previous_period_start = datetime.now(timezone.utc) - timedelta(days=30)
    previous_disasters = [
        d for d in disasters if d['fields'].get('date', {}).get('created') and 
        datetime.fromisoformat(d['fields']['date']['created'].replace('Z', '+00:00')) < previous_period_start
    ]
    previous_count = len(previous_disasters)

    change = current_count - previous_count
    trend = 'up' if change > 0 else 'down' if change < 0 else 'stable'

    return {
        'value': current_count,
        'change': abs(change),
        'trend': trend
    }

def calculate_people_affected(disasters):
    """Calculate total people affected"""
    current_total = sum(
        int(d['fields'].get('total_affected', 0)) 
        for d in disasters 
        if isinstance(d['fields'].get('total_affected'), (int, str))
    )

    # Use timezone-aware datetime
    previous_period_start = datetime.now(timezone.utc) - timedelta(days=30)
    previous_total = sum(
        int(d['fields'].get('total_affected', 0))
        for d in disasters 
        if (
            isinstance(d['fields'].get('total_affected'), (int, str)) and
            d['fields'].get('date', {}).get('created') and
            datetime.fromisoformat(d['fields']['date']['created'].replace('Z', '+00:00')) < previous_period_start
        )
    )

    change = current_total - previous_total
    trend = 'up' if change > 0 else 'down' if change < 0 else 'stable'

    return {
        'value': current_total,
        'change': abs(change),
        'trend': trend
    }

def calculate_avg_response_time(disasters):
    """Calculate average response time"""
    response_times = []
    for d in disasters:
        created = d['fields'].get('date', {}).get('created')
        updated = d['fields'].get('date', {}).get('updated')
        if created and updated:
            # Convert to timezone-aware datetime objects
            created_dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
            updated_dt = datetime.fromisoformat(updated.replace('Z', '+00:00'))
            response_times.append((updated_dt - created_dt).total_seconds() / 60)

    current_avg = sum(response_times) / len(response_times) if response_times else 0

    # Use timezone-aware datetime for comparison
    previous_period_start = datetime.now(timezone.utc) - timedelta(days=30)
    previous_response_times = []
    for d in disasters:
        created = d['fields'].get('date', {}).get('created')
        updated = d['fields'].get('date', {}).get('updated')
        if created and updated:
            created_dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
            if created_dt < previous_period_start:
                updated_dt = datetime.fromisoformat(updated.replace('Z', '+00:00'))
                previous_response_times.append((updated_dt - created_dt).total_seconds() / 60)

    previous_avg = sum(previous_response_times) / len(previous_response_times) if previous_response_times else 0

    change = current_avg - previous_avg
    trend = 'up' if change > 0 else 'down' if change < 0 else 'stable'

    return {
        'value': round(current_avg, 2),
        'change': abs(round(change, 2)),
        'trend': trend
    }

@app.route('/api/insights', methods=['GET'])
def get_insights():
    try:
        data = fetch_disaster_data()
        return jsonify({
            'status': 'success',
            'data': data
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)