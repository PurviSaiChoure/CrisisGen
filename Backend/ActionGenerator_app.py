from flask import Flask, request, jsonify
from flask_cors import CORS
from phi.agent import Agent, RunResponse
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from dotenv import load_dotenv
from phi.model.together import Together
import json
import logging
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ValidationError

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Pydantic models for response validation
class DisasterActionPlan(BaseModel):
    disaster_type: str = Field(..., description="Type of disaster, e.g., flood, earthquake, wildfire.")
    immediate_actions: List[str] = Field(..., description="List of immediate actions to be taken during the disaster.")
    resource_mobilization: List[str] = Field(..., description="Steps for mobilizing available resources effectively.")
    long_term_measures: List[str] = Field(..., description="Strategies for long-term relief and recovery.")
    stakeholders: List[str] = Field(..., description="List of stakeholders involved in the response.")
    recommendations: List[str] = Field(..., description="Actionable recommendations for governments, NGOs, and individuals.")

def initialize_agents():
    """Initialize single agent for plan generation"""
    
    # Single comprehensive agent
    action_plan_agent = Agent(
        name="Action Plan Generator",
        model=Together(id="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"),
        description="Generate comprehensive disaster response plans",
        structured_outputs=False,
        instructions=[
            "You are a disaster response planning expert.",
            "Generate detailed and actionable plans based on the provided scenario.",
            "Include specific steps, resource allocation, and recommendations.",
            "Format output as clean JSON with no additional text.",
            "Ensure comprehensive coverage of all aspects of disaster response."
        ]
    )

    return action_plan_agent

def extract_json_from_response(response: Any) -> Optional[Dict[str, Any]]:
    """Enhanced JSON extraction from agent response"""
    try:
        # Case 1: Response is already a Pydantic model
        if isinstance(response, DisasterActionPlan):
            return response.dict()
        
        # Case 2: Response is a dictionary
        if isinstance(response, dict):
            return response
            
        # Case 3: Response is a RunResponse object
        if isinstance(response, RunResponse):
            content = str(response.content)
            # Remove metadata and format JSON
            content = re.sub(r'RunResponse.*?{', '{', content, flags=re.DOTALL)
            content = re.sub(r'content_type.*?$', '', content, flags=re.DOTALL)
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                pass
        
        # Case 4: Response is a string
        if isinstance(response, str):
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                # Look for JSON-like structure in the string
                json_pattern = r'{[\s\S]*}'
                matches = re.findall(json_pattern, response, re.MULTILINE)
                for match in matches:
                    try:
                        return json.loads(match)
                    except json.JSONDecodeError:
                        continue
        
        return None
        
    except Exception as e:
        logger.error(f"Error extracting JSON: {str(e)}")
        return None

def generate_action_plan_prompt(data: Dict[str, str]) -> str:
    """Generate a focused prompt for the action plan"""
    return f"""
    Create a detailed disaster response plan for:
    - Disaster Type: {data['disasterType']}
    - Location: {data['location']}
    - Severity: {data['severity']}
    - Population Affected: {data['population']}
    - Available Resources: {data['resources']}

    Return a JSON object with exactly these keys:
    {{
        "disaster_type": "Detailed description of the disaster",
        "immediate_actions": [
            "5 specific, immediate actions to take",
            "Include emergency response steps",
            "Detail evacuation procedures",
            "Specify medical response",
            "Communication protocols"
        ],
        "resource_mobilization": [
            "5 detailed resource allocation strategies",
            "Specify supply chain management",
            "Include personnel deployment",
            "Detail equipment allocation",
            "Emergency resource acquisition"
        ],
        "long_term_measures": [
            "5 comprehensive recovery steps",
            "Infrastructure restoration",
            "Community rehabilitation",
            "Economic recovery",
            "Risk mitigation"
        ],
        "stakeholders": [
            "5 key organizations/groups",
            "Their specific roles",
            "Coordination mechanisms",
            "Response capabilities",
            "Resource contributions"
        ],
        "recommendations": [
            "5 specific, actionable recommendations",
            "Prevention measures",
            "Preparation guidelines",
            "Response improvements",
            "Recovery strategies"
        ]
    }}

    Make all items specific and detailed. Return only the JSON object.
    """

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/generate-action-plan', methods=['POST'])
def generate_action_plan():
    """Generate disaster response action plan"""
    try:
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'error': 'Content-Type must be application/json'
            }), 400

        data = request.json
        logger.info(f"Received request data: {data}")

        # Initialize agent
        agent = initialize_agents()
        
        # Generate prompt
        prompt = generate_action_plan_prompt(data)
        logger.info("Generated prompt for action plan")

        try:
            # Get response from agent
            logger.info("Requesting plan from agent...")
            response = agent.run(prompt)
            logger.info("Received response from agent")

            # Extract JSON from response
            action_plan = extract_json_from_response(response)
            
            if action_plan:
                logger.info("Successfully extracted action plan")
                return jsonify({
                    'status': 'success',
                    'action_plan': action_plan
                })
            else:
                logger.error("Failed to parse agent response")
                return jsonify({
                    'status': 'error',
                    'error': 'Failed to generate valid action plan'
                }), 500

        except Exception as agent_error:
            logger.error(f"Agent error: {str(agent_error)}")
            return jsonify({
                'status': 'error',
                'error': str(agent_error)
            }), 500

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("\n=== Starting Integrated Disaster Response Server ===")
    logger.info("Multi-agent system initialized")
    logger.info("Server will be available at http://localhost:5000")
    app.run(host='localhost', port=5000, debug=True)