from phi.agent import Agent, RunResponse
from phi.model.together import Together
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
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
    # Remove content tags and metadata
    text = re.sub(r'\*\*content=[\'"]\*\*', '', text)
    text = re.sub(r'\*\*Instructions.*$', '', text, flags=re.DOTALL)
    text = re.sub(r"content_type='str'.*$", '', text, flags=re.DOTALL)
    
    # Fix markdown headers
    # Replace #** with #
    text = re.sub(r'#\*\*', '#', text)
    # Remove standalone ** before headers
    text = re.sub(r'\*\*#', '#', text)
    # Remove ** around section titles
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    
    # Ensure proper header spacing and format
    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if line:
            # Proper header formatting
            if line.startswith('#'):
                # Remove any remaining asterisks around headers
                line = re.sub(r'\*\*([^*]+)\*\*', r'\1', line)
                # Ensure space after #
                line = re.sub(r'#([^ ])', r'# \1', line)
                lines.extend(['', line, ''])
            else:
                # Clean up bullet points
                if line.startswith('*'):
                    line = re.sub(r'^\*\s*', '* ', line)
                lines.append(line)
    
    # Join lines and clean up multiple newlines
    text = '\n'.join(lines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Clean up source links
    text = re.sub(r'\[(\d+)\]', r'[\1]:', text)
    
    # Final cleanup of any remaining unwanted characters
    text = text.replace('\\n', '\n')
    text = text.replace("\\'", "'")
    text = re.sub(r'\*\*$', '', text)  # Remove trailing asterisks
    text = re.sub(r"'$", '', text)     # Remove trailing quote
    
    return text.strip()

def format_markdown_sections(text):
    """Format markdown sections with proper spacing and hierarchy"""
    sections = {
        'Current Situation': [
            'Detailed Overview of the Disaster',
            'Key Statistics and Timeline',
            'Severity and Scale of the Impact',
            'Current Status of Emergency Response'
        ],
        'Affected Areas': [
            'Specific Regions and Communities Impacted',
            'Population Affected',
            'Infrastructure Damage Assessment',
            'Economic Impact Estimates'
        ],
        'Environmental Impacts': [
            'Immediate Environmental Effects',
            'Long-term Environmental Concerns',
            'Wildlife and Ecosystem Impacts',
            'Climate and Weather Implications'
        ],
        'Ongoing Relief Efforts': [
            'Emergency Response Operations',
            'Organizations Involved',
            'Resources Deployed',
            'Recovery Progress and Challenges'
        ],
        'Recommendations': [
            'For Government Agencies',
            'For NGOs',
            'For Individual Citizens'
        ],
        'Sources': []
    }
    
    formatted_text = []
    current_section = None
    
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        # Main section headers
        if line.startswith('# '):
            section_title = line[2:].strip()
            if section_title in sections:
                current_section = section_title
                formatted_text.extend(['', f'# {section_title}', ''])
                
        # Subsection headers
        elif line.startswith('## '):
            formatted_text.extend(['', line, ''])
            
        # Content
        else:
            formatted_text.append(line)
    
    return '\n'.join(formatted_text)

# Web Search Agent for real-time updates
web_search_agent = Agent(
    name="Web Search Agent",
    role="Search the web for disaster-related news and information",
    model=Together(id="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"),
    tools=[DuckDuckGo()],
    instructions=[
        "Search extensively for the latest disaster information",
        "Include specific details: dates, numbers, statistics",
        "Gather information from multiple reliable sources",
        "Track the chronological development of the disaster",
        "Include source citations for key information",
        "Focus on verified facts and official statements",
    ],
    show_tool_calls=True,
    verbose=True,
)

# Research Agent for disaster response information
research_agent = Agent(
    name="Research Agent",
    role="Gather in-depth disaster response research",
    model=Together(id="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"),
    tools=[DuckDuckGo(), Newspaper4k()],
    description="Expert in Emergency Management and Humanitarian Crisis Research",
    instructions=[
        "Conduct thorough analysis of disaster impacts and responses",
        "Include detailed statistics and damage assessments",
        "Research historical context and similar past events",
        "Analyze economic implications and recovery timelines",
        "Study environmental and social impacts",
        "Document specific relief organizations and their efforts",
        "Include expert opinions and scientific data",
        "Cite sources for key findings and statistics",
    ],
    show_tool_calls=True,
    verbose=True,
)

# Synthesis Agent for combining and structuring information
synthesis_agent = Agent(
    name="Synthesis Agent",
    role="Synthesize and structure disaster information",
    model=Together(id="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"),
    instructions=[
        "Create a comprehensive, well-structured report with these sections:",
        
        "# Current Situation",
        "- Detailed overview of the disaster",
        "- Key statistics and timeline",
        "- Severity and scale of the impact",
        "- Current status of emergency response",
        
        "# Affected Areas",
        "- Specific regions and communities impacted",
        "- Population affected (numbers and demographics)",
        "- Infrastructure damage assessment",
        "- Economic impact estimates",
        
        "# Environmental Impacts",
        "- Immediate environmental effects",
        "- Long-term environmental concerns",
        "- Wildlife and ecosystem impacts",
        "- Climate and weather implications",
        
        "# Ongoing Relief Efforts",
        "- Emergency response operations",
        "- Organizations involved (with specific details)",
        "- Resources deployed",
        "- International aid and support",
        "- Recovery progress and challenges",
        
        "# Recommendations",
        
        "## For Government Agencies",
        "- Immediate action items",
        "- Long-term strategic recommendations",
        "- Resource allocation suggestions",
        "- Policy implications",
        
        "## For NGOs",
        "- Priority areas for intervention",
        "- Coordination strategies",
        "- Resource mobilization approaches",
        "- Long-term support programs",
        
        "## For Individual Citizens",
        "- Safety measures and precautions",
        "- Ways to help and contribute",
        "- Preparation recommendations",
        "- Community support initiatives",
        
        "# Sources",
        "- List all sources with dates",
        "- Include official websites and news sources",
        
        "Ensure comprehensive coverage of each section with specific details.",
        "Use clear, professional language.",
        "Include relevant statistics and data.",
        "Maintain proper markdown formatting.",
    ],
    show_tool_calls=False,
    verbose=True,
    markdown=True,
)

def format_query(filters):
    """Format detailed search queries based on filters"""
    timeframe_map = {
        "24h": "24 hours",
        "7d": "7 days",
        "30d": "30 days"
    }
    
    location_part = f"in {filters['location']}" if filters.get('location') else "globally"
    time_part = f"during the last {timeframe_map.get(filters.get('timeframe', ''))}" if filters.get('timeframe') else ""
    
    return {
        'search_query': (
            f"Comprehensive search for {filters['disasterType']} {location_part} {time_part}. "
            f"Include latest updates, statistics, damage assessments, and official statements. "
            f"Focus on specific details and verified information from multiple sources."
        ),
        'research_query': (
            f"In-depth analysis of {filters['disasterType']} {location_part} {time_part}. "
            f"Research impacts, response efforts, environmental effects, economic implications, "
            f"and historical context. Include expert opinions and scientific data."
        ),
        'synthesis_query': (
            f"Create a detailed report on the {filters['disasterType']} situation {location_part} {time_part}. "
            f"Combine all gathered information into a comprehensive analysis with proper citations."
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
            # Step 1: Gather current information with expanded details
            logger.info("Gathering detailed current information...")
            current_info: RunResponse = web_search_agent.run(queries['search_query'])

            # Step 2: Conduct in-depth research
            logger.info("Conducting comprehensive research...")
            research_info: RunResponse = research_agent.run(queries['research_query'])

            # Step 3: Synthesize detailed report
            logger.info("Creating comprehensive report...")
            synthesis_prompt = (
                f"Create a detailed, well-structured report using this information:\n\n"
                f"CURRENT INFORMATION:\n{current_info.content}\n\n"
                f"RESEARCH FINDINGS:\n{research_info.content}\n\n"
                f"Ensure comprehensive coverage of all sections with specific details, "
                f"statistics, and proper source citations. Format in clean markdown."
            )
            final_report: RunResponse = synthesis_agent.run(synthesis_prompt)

            if not final_report:
                raise ValueError("No response generated from synthesis agent")
            logger.info("Successfully generated comprehensive summary")
            
            # Clean and format the final report
            cleaned_report = clean_response(str(final_report.content))
            formatted_report = format_markdown_sections(cleaned_report)

            return jsonify({
                'status': 'success',
                'summary': formatted_report
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