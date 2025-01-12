from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from io import StringIO
import time
import re

# Load environment variables
load_dotenv()

# Create a unified disaster response agent
disaster_response_agent = Agent(
    name="Disaster Response Agent",
    role="Analyze and report on disaster situations",
    model=Groq(id="mixtral-8x7b-32768"),
    tools=[DuckDuckGo(), Newspaper4k()],
    description=(
        "You are an Emergency Management Specialist and Disaster Response Expert. "
        "Your role is to provide comprehensive analysis of disaster situations, "
        "including current status, impacts, and recommendations."
    ),
    instructions=[
        "Search for and analyze current disaster information",
        "Use reliable sources and provide factual summaries",
        "Structure responses clearly with specific sections",
        "Include actionable recommendations for different stakeholders",
        "Focus on verified information and practical insights"
    ],
    show_tool_calls=False,
    markdown=True
)

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'success',
        'message': 'Disaster Response API is running'
    })

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    try:
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'error': 'Request must be JSON'
            }), 400

        filters = request.json
        
        if 'disasterType' not in filters:
            return jsonify({
                'status': 'error',
                'error': 'disasterType is required'
            }), 400
        
        # Updated prompt with more specific instructions
        prompt = f"""
As a Disaster Response Expert, provide a detailed analysis of the current {filters['disasterType']} situation
{f'in {filters["location"]}' if filters.get('location') else ''}
{f'during {filters.get("timeframe")}' if filters.get('timeframe') else ''}.

Use the following structure and provide SPECIFIC, DETAILED information for each section:

# Current Situation
Provide a comprehensive overview of the current state, including scale, intensity, and immediate threats.

# Affected Areas
List specific regions, neighborhoods, and communities impacted, with details about the extent of damage.

# Environmental Impacts
Detail specific environmental consequences, including air quality, wildlife impact, and ecosystem damage.

# Ongoing Relief Efforts
Describe specific organizations involved, current response activities, and resources being deployed.

# Recommendations

## For Government Agencies
Provide specific, actionable steps that government agencies should take immediately.

## For NGOs
List concrete actions and initiatives that NGOs can implement to support relief efforts.

## For Individual Citizens
Outline practical steps that residents can take to stay safe and support recovery efforts.

Use current data and reliable sources. Provide specific details rather than general statements.
"""

        print(f"Processing query with prompt: {prompt}")

        output = StringIO()
        sys.stdout = output

        try:
            max_retries = 3
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    disaster_response_agent.print_response(prompt, stream=False)
                    break
                except Exception as e:
                    if 'rate_limit_exceeded' in str(e):
                        retry_count += 1
                        if retry_count < max_retries:
                            print(f"Rate limit hit, retrying in 5 seconds... (Attempt {retry_count}/{max_retries})")
                            time.sleep(5)
                            continue
                    raise e

            sys.stdout = sys.__stdout__
            response = output.getvalue()

            if not response:
                raise ValueError("No response generated")

            # Clean up the response
            ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
            cleaned_response = ansi_escape.sub('', response)

            # Remove box drawing characters and formatting
            box_chars = re.compile(r'[┃┏┓┗┛━]')
            cleaned_response = box_chars.sub('', cleaned_response)

            # Find the actual content (everything after the second occurrence of "Current Situation")
            parts = cleaned_response.split("Current Situation")
            if len(parts) > 2:
                cleaned_response = "# Current Situation" + parts[2]  # Take the content after the second occurrence

            # Remove any lines containing template instructions or metadata
            cleaned_response = '\n'.join(
                line for line in cleaned_response.splitlines()
                if line.strip() and not any(x in line.lower() for x in [
                    'message', 'response', 'tool_call',
                    'provide', 'list specific', 'detail specific',
                    'describe specific', 'outline practical',
                    'use current data', 'provide specific details'
                ])
            )

            # Ensure proper section formatting
            sections = []
            current_section = []
            current_title = None

            for line in cleaned_response.splitlines():
                line = line.strip()
                if line:
                    if line.startswith('#'):
                        if current_section:
                            content = '\n'.join(current_section)
                            if current_title and content:
                                sections.append(f"{current_title}\n{content}")
                        current_title = line
                        current_section = []
                    else:
                        current_section.append(line)

            if current_section and current_title:
                content = '\n'.join(current_section)
                sections.append(f"{current_title}\n{content}")

            cleaned_response = '\n\n'.join(sections)
            
            print("Cleaned response:", cleaned_response)  # Debug log

            # Parse the sections into a structured format
            parsed_summary = {
                'currentSituation': '',
                'affectedAreas': '',
                'environmentalImpacts': '',
                'reliefEfforts': '',
                'recommendations': {
                    'government': '',
                    'ngos': '',
                    'citizens': ''
                }
            }

            current_section = None
            for line in cleaned_response.splitlines():
                line = line.strip()
                if line.startswith('# '):
                    section_title = line[2:].lower()
                    if 'current situation' in section_title:
                        current_section = 'currentSituation'
                    elif 'affected areas' in section_title:
                        current_section = 'affectedAreas'
                    elif 'environmental impacts' in section_title:
                        current_section = 'environmentalImpacts'
                    elif 'ongoing relief efforts' in section_title:
                        current_section = 'reliefEfforts'
                    elif 'recommendations' in section_title:
                        current_section = 'recommendations'
                elif line.startswith('## For Government'):
                    current_section = 'government'
                elif line.startswith('## For NGOs'):
                    current_section = 'ngos'
                elif line.startswith('## For Individual'):
                    current_section = 'citizens'
                elif line and current_section:
                    if current_section in parsed_summary:
                        parsed_summary[current_section] += line + '\n'
                    elif current_section in ['government', 'ngos', 'citizens']:
                        parsed_summary['recommendations'][current_section] += line + '\n'

            # Clean up the parsed sections
            for key in parsed_summary:
                if isinstance(parsed_summary[key], str):
                    parsed_summary[key] = parsed_summary[key].strip()
                elif isinstance(parsed_summary[key], dict):
                    for subkey in parsed_summary[key]:
                        parsed_summary[key][subkey] = parsed_summary[key][subkey].strip()

            return jsonify({
                'status': 'success',
                'summary': parsed_summary,
                'filters': filters
            })

        except Exception as agent_error:
            sys.stdout = sys.__stdout__
            print(f"Agent error: {str(agent_error)}")
            
            if 'rate_limit_exceeded' in str(agent_error):
                return jsonify({
                    'status': 'error',
                    'error': 'Service is temporarily busy. Please try again in a few minutes.'
                }), 429
            
            return jsonify({
                'status': 'error',
                'error': f"Failed to generate summary: {str(agent_error)}"
            }), 500

    except Exception as e:
        sys.stdout = sys.__stdout__
        print(f"Server error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': f"Server error: {str(e)}"
        }), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'status': 'error',
        'error': 'Resource not found'
    }), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({
        'status': 'error',
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("API will be available at http://localhost:5000")
    print("Disaster Response Agent initialized and ready")
    app.run(debug=True, host='0.0.0.0', port=5000)
