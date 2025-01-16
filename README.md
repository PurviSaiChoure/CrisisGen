# CrisisGen

CrisisGen is a web application designed to provide real-time disaster management solutions. It leverages advanced AI technologies to generate disaster summaries, coordinate responses, and facilitate communication among stakeholders, including citizens, NGOs, and government agencies.

## Objective

To design an AI system that helps stakeholders (citizens, NGOs, and governments) during disasters by:

- Generating real-time disaster summaries.
- Suggesting actionable plans based on the severity and nature of the disaster.
- Creating custom communication templates for affected populations or response teams.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### Pages in the Website

1. **Home Page** (`/src/pages/Home.tsx`):
   - Introduces the platform, its features, and how it works.
   - Key Features:
     - Hero Section with a striking headline and dynamic map.
     - Overview of features like real-time disaster summaries and action plan generator.
     - User segmentation options for tailored content.

2. **Dashboard Page** (`/src/pages/Dashboard.tsx`):
   - Displays real-time disaster information and tools for generating summaries, plans, and templates.
   - Key Features:
     - Interactive map with disaster markers.
     - Live disaster feed with filtering options.
     - Action buttons for generating summaries and creating action plans.

3. **Action Plan Generator Page** (`/src/pages/ActionPlan.tsx`):
   - Allows users to create and customize detailed action plans.
   - Key Features:
     - Input form for disaster type, affected regions, and available resources.
     - Display of AI-generated action plans.

4. **Communication Template Page** (`/src/pages/Communication.tsx`):
   - Generates and customizes alerts, updates, or resource requests.
   - Key Features:
     - Template options for alerts and resource appeals.
     - Customization panel for editable fields.

5. **Insights and Analytics Page** (`/src/pages/Insights.tsx`):
   - Provides visual and statistical insights for policymakers or NGOs.
   - Key Features:
     - Graphs and charts for affected population trends.
     - Predictive analytics for disaster-prone areas.

6. **About Us Page** (`/src/pages/About.tsx`):
   - Explains the mission and vision behind CrisisGen.
   - Key Features:
     - Introduction to the team and collaboration opportunities.

7. **Contact Us Page** (`/src/pages/Contact.tsx`):
   - Allows users to get in touch for queries, feedback, or partnerships.
   - Key Features:
     - Contact form and direct contact information.

## Technologies Used

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Flask, Python, Llama (GenAi)
- **Database**: SQLite 
- **Deployment**: Vercel (for frontend), Heroku (for backend) 

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/GenCrisis.git
   cd GenCrisis
   ```

2. **Set up the backend**:
   - Navigate to the `Backend` directory:
     ```bash
     cd Backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```bash
       venv\Scripts\activate
       ```
     - On macOS/Linux:
       ```bash
       source venv/bin/activate
       ```
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
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
   ```bash
   python app.py
   ```

5. **Run the frontend**:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` for the frontend.
2. Use the application to generate disaster summaries by selecting the appropriate filters.
3. View the generated summaries and insights in real-time.

## API Endpoints

- **POST /generate-summary**: Generates a disaster summary based on the provided filters.
  - **Request Body**:
    ```json
    {
      "disasterType": "string",
      "location": "string",
      "timeframe": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "summary": "string"
    }
    ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please contact:

- **Your Name**: [your.email@example.com](mailto:your.email@example.com)
- **GitHub**: [yourusername](https://github.com/yourusername)

---

Thank you for using GenCrisis! We hope it helps you in disaster management and response.