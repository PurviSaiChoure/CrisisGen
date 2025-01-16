from flask import Flask, request, jsonify
from flask_cors import CORS
from phi.agent import Agent, RunResponse
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from dotenv import load_dotenv
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
    """Initialize all agents in the system"""
    
    # Reasoning Agent for analysis
    reasoning_agent = Agent(
        model=Groq(id="mixtral-8x7b-32768"),
        name="Reasoning Agent",
        role="Analyze disaster scenarios and generate logical action plans.",
        reasoning=True,
        markdown=True,
        structured_outputs=True,
        instructions=[
            "Take disaster type and available resources as inputs.",
            "Break down the response into three key sections: Immediate Actions, Resource Mobilization, and Long-term Relief Measures.",
            "Provide clear, logical steps for each section.",
            "Use structured bullet points or ASCII diagrams for clarity where necessary."
        ]
    )

    # Research Agent for gathering information
    research_agent = Agent(
        name="Research Agent",
        role="Gather additional information about disaster scenarios and best practices.",
        model=Groq(id="mixtral-8x7b-32768"),
        tool=[DuckDuckGo(), Newspaper4k()],
        instructions=[
            "Search for recent events and response guidelines related to the given disaster type.",
            "Summarize actionable strategies from credible sources.",
            "Provide links to sources for reference.",
        ],
        show_tool_calls=True,
        markdown=True,
    )

    # Data Analyst Agent for resource allocation
    data_analyst_agent = Agent(
        name="Data Analyst Agent",
        role="Analyze resources and allocate them efficiently in the action plan.",
        model=Groq(id="mixtral-8x7b-32768"),
        instructions=[
            "Analyze the available resources and determine the most efficient allocation.",
            "Provide visualizations or summaries of resource usage.",
            "Focus on minimizing waste and maximizing impact during disaster response.",
        ],
        show_tool_calls=False,
        markdown=True,
    )

    # RAG Agent for knowledge retrieval
    rag_agent = Agent(
        name="RAG Agent",
        role="Retrieve and combine external knowledge for disaster response planning.",
        model=Groq(id="mixtral-8x7b-32768"),
        tool=[DuckDuckGo()],
        instructions=[
            "Retrieve data from external sources related to the given disaster type.",
            "Combine the retrieved knowledge with accurate strategies to enhance the action plan.",
            "Ensure the action plan is updated dynamically based on new information.",
        ],
        show_tool_calls=True,
        markdown=True,
    )

    # Action Plan Generator Agent
    action_plan_agent = Agent(
        name="Action Plan Generator",
        model=Groq(id="mixtral-8x7b-32768"),
        description="Generate a structured disaster action plan.",
        response_model=DisasterActionPlan,
        structured_outputs=True,
        instructions=[
            "Based on the provided disaster type and resources, generate a detailed and actionable plan.",
            "Always format the response as a valid JSON object with these exact keys:",
            "- disaster_type (string)",
            "- immediate_actions (array of strings)",
            "- resource_mobilization (array of strings)",
            "- long_term_measures (array of strings)",
            "- stakeholders (array of strings)",
            "- recommendations (array of strings)",
            "Ensure all arrays contain at least 3 items.",
            "Make all responses specific and actionable.",
        ],
    )

    # Return all individual agents
    return reasoning_agent, research_agent, data_analyst_agent, rag_agent, action_plan_agent

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

def get_fallback_plan(data: Dict[str, str]) -> Dict[str, Any]:
    """Provide a fallback plan when agent fails"""
    return {
        "disaster_type": data.get('disasterType', 'Unknown'),
        "immediate_actions": [
            "Evacuate affected areas immediately",
            "Set up emergency response centers",
            "Deploy first responder teams"
        ],
        "resource_mobilization": [
            "Mobilize medical supplies and personnel",
            "Establish emergency shelters",
            "Coordinate with local authorities"
        ],
        "long_term_measures": [
            "Develop infrastructure recovery plan",
            "Implement community support programs",
            "Establish long-term housing solutions"
        ],
        "stakeholders": [
            "Local Emergency Services",
            "Medical Response Teams",
            "Volunteer Organizations"
        ],
        "recommendations": [
            "Maintain emergency supply stockpiles",
            "Regular disaster response drills",
            "Update evacuation protocols"
        ]
    }

def generate_comprehensive_plan(data: Dict[str, str], agents: List[Agent]) -> Dict[str, Any]:
    """Generate a comprehensive plan using all agents"""
    
    # Get base information from reasoning agent
    reasoning_response = agents[0].run(
        f"Analyze the {data['severity']} {data['disasterType']} disaster in {data['location']}. "
        f"Consider population of {data['population']} and resources: {data['resources']}. "
        "Provide detailed immediate actions, resource needs, and long-term strategies."
    )

    # Get research-backed information
    research_response = agents[1].run(
        f"Research recent {data['disasterType']} disasters and effective response strategies. "
        f"Focus on {data['location']} region and similar scenarios. "
        "Include specific protocols and best practices."
    )

    # Get resource allocation strategy
    resource_response = agents[2].run(
        f"Analyze resource requirements for {data['disasterType']} response. "
        f"Available resources: {data['resources']}. Population: {data['population']}. "
        "Provide detailed mobilization and distribution strategy."
    )

    # Get knowledge-based recommendations
    knowledge_response = agents[3].run(
        f"Provide comprehensive recommendations for {data['disasterType']} in {data['location']}. "
        "Include stakeholder coordination, communication protocols, and long-term recovery strategies."
    )

    # Combine all insights into structured plan
    combined_prompt = f"""
    Create a detailed disaster response plan combining these insights:
    
    Reasoning Analysis: {reasoning_response}
    Research Findings: {research_response}
    Resource Strategy: {resource_response}
    Expert Recommendations: {knowledge_response}
    
    Format as JSON with these sections:
    - disaster_type: Detailed description of the disaster
    - immediate_actions: At least 5 specific, actionable steps
    - resource_mobilization: Detailed resource allocation strategy
    - long_term_measures: Comprehensive recovery plan
    - stakeholders: All relevant parties with their roles
    - recommendations: Specific, actionable recommendations
    """

    # Generate final structured plan
    final_plan = agents[4].run(combined_prompt)
    return extract_json_from_response(final_plan)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/generate-action-plan', methods=['POST'])
def generate_action_plan():
    """Generate disaster response action plan using multi-agent system"""
    try:
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'error': 'Content-Type must be application/json'
            }), 400

        data = request.json
        logger.info(f"Received data: {data}")

        try:
            # Initialize all agents
            reasoning_agent, research_agent, data_analyst_agent, rag_agent, action_plan_agent = initialize_agents()
            agents = [reasoning_agent, research_agent, data_analyst_agent, rag_agent, action_plan_agent]

            # Generate comprehensive plan
            action_plan = generate_comprehensive_plan(data, agents)
            
            if action_plan:
                try:
                    # Validate and enhance the plan
                    validated_plan = DisasterActionPlan(**action_plan)
                    return jsonify({
                        'status': 'success',
                        'action_plan': validated_plan.dict()
                    })
                except ValidationError as validation_error:
                    logger.error(f"Validation error: {validation_error}")
                    return jsonify({
                        'status': 'error',
                        'error': 'Invalid plan format'
                    }), 500
            else:
                logger.error("Failed to generate plan")
                return jsonify({
                    'status': 'error',
                    'error': 'Failed to generate plan'
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