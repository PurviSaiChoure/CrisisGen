# CrisisGen

CrisisGen is a web application designed to provide real-time disaster management solutions. It leverages advanced AI technologies to generate disaster summaries, coordinate responses, and facilitate communication among stakeholders, including citizens, NGOs, and government agencies.

## Objective

To design an AI system that helps stakeholders (citizens, NGOs, and governments) during disasters by:

- Generating real-time disaster summaries using **Generative AI (GenAI)** technologies.
- Suggesting actionable plans based on the severity and nature of the disaster through **Agentic AI** capabilities.
- Facilitating communication among stakeholders to ensure timely and effective responses.

## Features

- **Real-time Disaster Summaries**: Automatically generates summaries of ongoing disasters using AI, providing stakeholders with up-to-date information.
- **Action Plan Generation**: Utilizes AI to create actionable plans tailored to specific disaster scenarios, ensuring that responses are efficient and effective.
- **Communication Tools**: Enables stakeholders to communicate effectively during crises, allowing for coordinated efforts and resource sharing.
- **Insights and Analytics**: Offers insights into disaster trends and statistics, helping stakeholders make informed decisions based on data.

## Technologies Used

- **Frontend**: 
  - **React**: A JavaScript library for building user interfaces, allowing for a dynamic and responsive user experience.
  - **React Router**: For navigation between different components and pages within the application.
  - **Framer Motion**: A library for animations, enhancing the user experience with smooth transitions and effects.
 
- **Backend**: 
  - **Flask**: A lightweight WSGI web application framework in Python, used to build the backend services and APIs.
  - **Generative AI (GenAI)**: Utilized for generating disaster summaries and actionable plans based on real-time data inputs.
  - **Agentic AI**: Employed to facilitate intelligent decision-making processes and automate responses based on the severity of disasters.

- **Database**: 
  - **DuckDB**: An in-process SQL OLAP database management system, used for efficient data storage and querying of disaster-related information.

- **APIs**: 
  - Integration with various external APIs for real-time data fetching, including disaster data, news updates, and AI model interactions.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/CrisisGen.git
   cd CrisisGen
   ```

2. **Set up the backend**:
   - Navigate to the `Backend` directory:
     ```bash
     cd Backend
     ```
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
     ```
   - Create a `.env` file in the `Backend` directory and add your API keys:
     ```plaintext
     PHI_API_KEY="your_phi_api_key"
     GROQ_API_KEY="your_groq_api_key"
     API_SECRET_KEY="your_api_secret_key"
     TOGETHER_API_KEY="your_together_api_key"
     ```

3. **Set up the frontend**:
   - Navigate to the `src` directory:
     ```bash
     cd src
     ```
   - Install the required packages:
     ```bash
     npm install
     ```

4. **Run the backend**:
   - Start the Flask server:
     ```bash
     python ActionGenerator_app.py
     ```

5. **Run the frontend**:
   - Start the React application:
     ```bash
     npm start
     ```

## Usage

- Access the application in your browser at `http://localhost:3000`.
- Use the dashboard to view ongoing disasters and generate summaries.
- Utilize the communication tools to send messages to stakeholders.
- Explore the Insights page to analyze disaster trends and statistics.

## 🌐 API Endpoints

### Summary Generation
- `POST /generate-summary`: Generate comprehensive disaster reports
- `POST /download-summary`: Download formatted summaries
- `POST /share-summary`: Share summaries via email

### Action Planning
- `POST /generate-action-plan`: Generate strategic response plans

### Dashboard Data
- `GET /dashboard/map-data`: Real-time disaster location data
- `GET /dashboard/stats`: Current response statistics
- `GET /dashboard/activity`: Response activity metrics
- `GET /dashboard/recent-alerts`: Latest disaster alerts

## 🤖 AI Agent Specifications

### Web Search Agent
- **Purpose**: Real-time information gathering
- **Tools**: DuckDuckGo integration
- **Capabilities**: Web scraping, data verification, source credibility assessment

### Research Agent
- **Purpose**: In-depth analysis
- **Tools**: DuckDuckGo, Newspaper4k
- **Capabilities**: Historical data analysis, pattern recognition, impact assessment

### Synthesis Agent
- **Purpose**: Information structuring
- **Model**: Llama-3.3-70B-Instruct-Turbo
- **Capabilities**: Content organization, report generation, key insight extraction

## 📊 Data Processing Pipeline

1. **Data Collection**
   - Real-time web scraping
   - API integrations
   - Historical data analysis

2. **Processing**
   - Multi-agent information synthesis
   - Context-aware filtering
   - Credibility assessment

3. **Output Generation**
   - Structured reports
   - Action plans
   - Communication templates

## 🔒 Security Features

- API key authentication
- Rate limiting
- CORS protection
- Secure email integration
- Environment variable protection

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Together AI for LLM access
- Groq for high-performance inference
- ReliefWeb for disaster data
- OpenStreetMap for mapping data

## Contact

For any inquiries, please contact:

- **Purvi Choure**: [purvi.choure@gmail.com](mailto:purvi.choure@gmail.com)
- **GitHub**: [PurviChoure](https://github.com/PurviChoure)

---

Thank you for using CrisisGen! We hope it helps you in disaster management and response.