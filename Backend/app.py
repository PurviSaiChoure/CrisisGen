from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from dotenv import load_dotenv
import json
from phi.agent.duckdb import DuckDbAgent

load_dotenv()

# Web Search Agent for real-time updates
web_search_agent = Agent(
    name="Web Search Agent",
    role="Search the web for disaster-related news and information",
    model=Groq(id="llama-3.3-70b-versatile"),
    tool=[DuckDuckGo()],
    instructions=["Always include sources", "Prioritize emergency and relief efforts"],
    show_tool_calls=True,
    markdown=True,
)

# Research Agent for disaster response information
research_agent = Agent(
    name="Research Agent",
    role="Gather in-depth disaster response research",
    model=Groq(id="llama-3.3-70b-versatile"),
    tool=[DuckDuckGo(), Newspaper4k()],  # Can crawl emergency response data from relevant sources
    description = "You are a Emergency Management Specialist and a senior Humanitarian Crisis Researcher writing an article on disasters taking place.",
    instructions=["For a given topic, search for the top 5 links.",
        "Then read each URL and extract the article text, if a URL isn't available, ignore it.",
        "Analyse and prepare a high level article based on the information.",
        "Focus on disaster preparedness, relief strategies, and recovery efforts"],
    show_tool_calls=True,
    markdown=True,
)

# Data Analyst Agent for data analysis and trends
'''data_analyst_agent = Agent(
    name="Data Analyst Agent",
    role="Analyze structured disaster-related data",
    model=Groq(id="llama3-groq-70b-8192-tool-use-preview"),
    tool=[WeatherAPI(), SatelliteImageTool()],  # Weather and satellite data processing
    instructions=["Analyze patterns in weather data and satellite imagery to predict disaster impacts"],
    show_tool_calls=True,
    markdown=True,
)'''

data_analyst = DuckDbAgent(
    model=Groq(id="llama-3.3-70b-versatile"),
    semantic_model=json.dumps(
        {
            "tables": [
                {
                    "name": "movies",
                    "description": "Contains information about ongoing disasters around the world.",
                    "path": "https://reliefweb.int/disasters?view=ongoing",
                }
            ]
        }
    ),
    instructions=[
        "Use data to identify trends and generate insights.",
        "Prepare visual representations (ASCII histograms) where applicable.",
        "Focus on disaster mitigation and recovery strategies.",
    ],
    markdown=True,
)

# Combining agents for multi-agent disaster response system
multi_ai_agent = Agent(
    team=[web_search_agent, research_agent, data_analyst],
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=["Provide real-time disaster updates, predictions, and response strategies", 
                  "Use structured output and always include sources",
                  "Generate a structured report including key trends, insights, and actionable recommendations.",
                  "Analyze data to identify trends and generate insights."],
    show_tool_calls=True,
    markdown=True,
)

# Querying the multi-agent system for disaster-related data
multi_ai_agent.print_response(
    "Provide a detailed analysis of the current flooding situation in the Himalayas. Include affected areas, environmental impacts, and ongoing relief efforts. Provide actionable recommendations for governments, NGOs, and individuals.",
    stream=True
)