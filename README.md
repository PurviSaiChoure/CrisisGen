# CrisisGen

CrisisGen is a web application designed to provide real-time disaster management solutions. It leverages advanced AI technologies to generate disaster summaries, coordinate responses, and facilitate communication among stakeholders, including citizens, NGOs, and government agencies.

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

- **Real-time Disaster Tracking**: Monitor disasters as they unfold with advanced mapping.
- **Automated Summary Generation**: Generate comprehensive disaster summaries based on user-defined filters.
- **User Segmentation**: Tailored solutions for citizens, NGOs, and government agencies.
- **Live Analytics**: Get real-time insights and predictive analysis for better decision-making.
- **Smart Communication**: Automated alerts and communication templates for quick deployment.

## Technologies Used

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Flask, Python
- **Database**: SQLite (or any other database you choose)
- **Deployment**: Vercel (for frontend), Heroku (for backend) or any other cloud service

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