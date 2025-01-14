from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from io import StringIO
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

def clean_response(text):
    """Clean and format the response text"""
    try:
        # Remove RunResponse metadata
        text = re.sub(r"content='(.*?)'.*$", r'\1', text, flags=re.DOTALL)
        text = re.sub(r'content=.*?Running:', '', text, flags=re.DOTALL)
        
        # Remove system messages and instructions
        text = re.sub(r'Message\(role=.*?\)', '', text, flags=re.DOTALL)
        text = re.sub(r'Instructions:.*?\\n', '', text, flags=re.DOTALL)
        
        # Clean up newlines and markdown
        text = text.replace('\\n', '\n')  # Convert literal \n to actual newlines
        text = re.sub(r'\n{3,}', '\n\n', text)  # Remove excessive newlines
        
        # Fix markdown headers
        text = re.sub(r'#\s*([^#\n]+?)(?=\n|$)', r'# \1', text)  # Fix main headers
        text = re.sub(r'#{2}\s*([^#\n]+?)(?=\n|$)', r'## \1', text)  # Fix subheaders
        
        # Remove any remaining metadata or system text
        text = re.sub(r'RunResponse.*?\\n', '', text)
        text = re.sub(r'content_type=.*?(?=\n|$)', '', text)
        text = re.sub(r'event=.*?(?=\n|$)', '', text)
        text = re.sub(r'messages=.*?(?=\n|$)', '', text)
        
        # Clean up any remaining special characters
        text = re.sub(r'\\+["\']', '', text)  # Remove escaped quotes
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        
        # Ensure proper section spacing
        sections = text.split('#')
        cleaned_sections = []
        for section in sections:
            if section.strip():
                # Properly format section headers and content
                section = section.strip()
                if not section.startswith(' '):
                    section = ' ' + section
                cleaned_sections.append(section)
        
        text = '#'.join(cleaned_sections)
        
        # Final cleanup
        text = text.strip()
        text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)  # Remove triple newlines
        
        return text
        
    except Exception as e:
        logger.error(f"Error cleaning response: {str(e)}")
        # Return original text if cleaning fails
        return text

# Web Search Agent for real-time updates
web_search_agent = Agent(
    name="Web Search Agent",
    role="Search the web for disaster-related news and information",
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo()],
    instructions=[
        "Search for latest news and updates about the specified disaster",
        "Focus on verified sources and official reports",
        "Collect information about current status and immediate impacts",
        "Return information in a clear, narrative format",
    ],
    show_tool_calls=True,
    verbose=True,
)

# Research Agent for disaster response information
research_agent = Agent(
    name="Research Agent",
    role="Gather in-depth disaster response research",
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo(), Newspaper4k()],
    description="Expert in Emergency Management and Humanitarian Crisis Research",
    instructions=[
        "Research and analyze disaster response strategies",
        "Focus on relief efforts and recovery plans",
        "Gather information about environmental impacts",
        "Identify recommendations for different stakeholders",
        "Present information in a clear, narrative format without raw data",
    ],
    show_tool_calls=True,
    verbose=True,
)

# Synthesis Agent for combining and structuring information
synthesis_agent = Agent(
    name="Synthesis Agent",
    role="Synthesize and structure disaster information",
    model=Groq(id="llama-3.1-8b-instant"),
    instructions=[
        "Combine and structure information into a clean markdown report",
        "Format the report exactly as follows:",
        "",
        "# Current Situation",
        "<situation content>",
        "",
        "# Affected Areas",
        "<areas content>",
        "",
        "# Environmental Impacts",
        "<impacts content>",
        "",
        "# Ongoing Relief Efforts",
        "<efforts content>",
        "",
        "# Recommendations",
        "",
        "## For Government Agencies",
        "<government recommendations>",
        "",
        "## For NGOs",
        "<ngo recommendations>",
        "",
        "## For Individual Citizens",
        "<citizen recommendations>"
    ],
    show_tool_calls=False,
    verbose=True,
    markdown=True,
)

def format_query(filters):
    """Format the search query based on filters"""
    timeframe_map = {
        "24h": "24 hours",
        "7d": "7 days",
        "30d": "30 days"
    }
    
    location_part = f"in {filters['location']}" if filters.get('location') else "globally"
    time_part = f"during the last {timeframe_map.get(filters.get('timeframe', ''))}" if filters.get('timeframe') else ""
    
    return {
        'search_query': (
            f"Latest updates on {filters['disasterType']} {location_part} {time_part}. "
            "Provide information in a clear narrative format without raw data."
        ),
        'research_query': (
            f"Analysis of {filters['disasterType']} impacts and response efforts {location_part} {time_part}. "
            "Present findings in a narrative format without raw data or URLs."
        ),
        'synthesis_query': (
            f"Create a comprehensive report on the {filters['disasterType']} situation {location_part} {time_part}. "
            "Format as a clean markdown document with proper sections."
        )
    }

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    try:
        filters = request.json
        
        if 'disasterType' not in filters:
            return jsonify({
                'status': 'error',
                'error': 'Disaster type is required'
            }), 400

        logger.info(f"Generating summary for filters: {filters}")
        queries = format_query(filters)

        try:
            # Step 1: Gather current information
            logger.info("Gathering current information...")
            current_info = web_search_agent.run(queries['search_query'])

            # Step 2: Research response and impacts
            logger.info("Researching response and impacts...")
            research_info = research_agent.run(queries['research_query'])

            # Step 3: Synthesize information
            logger.info("Synthesizing information...")
            synthesis_prompt = (
                f"Based on these inputs:\n\n"
                f"CURRENT INFORMATION:\n{current_info}\n\n"
                f"RESEARCH INFORMATION:\n{research_info}\n\n"
                f"Create a comprehensive report following the specified structure. "
                f"Ensure proper markdown formatting and remove any raw data or metadata."
            )
            final_report = synthesis_agent.run(synthesis_prompt)

            if not final_report:
                raise ValueError("No response generated from synthesis agent")

            # Clean and format the final report
            cleaned_report = clean_response(str(final_report))
            
            logger.info("Successfully generated summary")
            
            return jsonify({
                'status': 'success',
                'summary': cleaned_report
            })

        except Exception as agent_error:
            logger.error(f"Agent error: {str(agent_error)}")
            return jsonify({
                'status': 'error',
                'error': "Unable to generate summary. Please try again later."
            }), 500

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': "An unexpected error occurred. Please try again later."
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    logger.info("API will be available at http://localhost:5000")
    logger.info("Multi-agent Disaster Response System initialized and ready")
    app.run(debug=True, port=5000)