# CrisisGen

CrisisGen is a web application designed to provide real-time disaster management solutions. It leverages advanced AI technologies to generate disaster summaries, coordinate responses, and facilitate communication among stakeholders, including citizens, NGOs, and government agencies.

## Objective

To design an AI system that helps stakeholders (citizens, NGOs, and governments) during disasters by:

- Generating real-time disaster summaries.
- Suggesting actionable plans based on the severity and nature of the disaster.
- Facilitating communication among stakeholders.

## Features

- **Real-time Disaster Summaries**: Automatically generates summaries of ongoing disasters using AI.
- **Action Plan Generation**: Provides actionable plans tailored to specific disaster scenarios.
- **Communication Tools**: Enables stakeholders to communicate effectively during crises.
- **Insights and Analytics**: Offers insights into disaster trends and statistics.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Technologies Used

- **Frontend**: Built with React, utilizing libraries such as React Router for navigation and Framer Motion for animations.
- **Backend**: Developed using Flask, with integrations for AI models and data processing.
- **Database**: Utilizes DuckDB for data storage and querying.

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

Thank you for using CrisisGen! We hope it helps you in disaster management and response.