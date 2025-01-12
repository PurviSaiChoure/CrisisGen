# project overview
Use this guide to build a web app which is basically a disaster response website, created using next.js. 

Objective
To design an AI system that helps stakeholders (citizens, NGOs, and governments) during disasters by:

Generating real-time disaster summaries.
Suggesting actionable plans based on the severity and nature of the disaster.
Creating custom communication templates for affected populations or response teams.

# Pages in the website
/src/pages/Home.tsx: 
Home Page: The Welcome Gateway
Purpose: Introduce the platform, its features, and how it works.
Key Features:

Hero Section:

A striking headline like: "AI-Powered Disaster Response at Your Fingertips."
Background: A dynamic map showing real-time disaster markers.
A call-to-action (CTA) button: “Get Started” or “View Current Disasters.”
Key Features Overview:

Cards or sections briefly describing the platform’s features:
Real-time disaster summaries.
Action plan generator.
Communication templates.
User Segmentation:

Options like “For Citizens,” “For NGOs,” “For Governments” to guide users to tailored content.
Footer:

Links to about, contact, terms of service, and social media handles.

/src/pages/Dashboard.tsx:
2. Dashboard Page: The Core Workspace
Purpose: Display real-time disaster information and provide tools for generating summaries, plans, and templates.
Key Features:

Map Visualization:

An interactive map with disaster markers (color-coded by severity).
Clicking a marker shows details like disaster type, affected areas, and severity.
Disaster Feed:

A live feed showing disaster events (with filtering options by location, type, and severity).
Action Buttons:

“Generate Summary”: Automatically summarize selected disaster details.
“Create Action Plan”: Generate a plan for selected disaster areas.
“Design Communication Template”: Generate messages for alerts or resource mobilization.
Sidebar:

Filters: Date, location, disaster type.
Quick links to saved action plans or reports.

/src/pages/ActionPlan.tsx: 
3. Action Plan Generator Page
Purpose: Allow users to create and customize detailed action plans.
Key Features:

Input Form:

Disaster type (dropdown or auto-detected).
Affected regions (select from map or list).
Available resources (manual input or predefined).
Generated Plan:

Display an AI-generated action plan (editable by the user).
Sections like:
Immediate actions.
Resource mobilization.
Long-term relief measures.
Download/Share Options:

Export as PDF, Word document, or email directly to stakeholders.

/src/pages/Communication.tsx
4. Communication Template Page
Purpose: Generate and customize alerts, updates, or resource requests.
Key Features:

Template Options:

Alerts for citizens (evacuation notices, warnings).
Resource appeals for NGOs (donations, volunteers).
Official updates for governments or media.
Customization Panel:

Editable fields for region, severity, and specific instructions.
Preview of the generated text.
Send/Export Options:

Direct integration with email, SMS, or social media APIs.
Downloadable text for manual distribution.

/src/pages/Insights.tsx
5. Insights and Analytics Page (Optional, Advanced Feature)
Purpose: Provide visual and statistical insights for policymakers or NGOs.
Key Features:

Graphs and Charts:

Affected population trends.
Resource allocation efficiency.
Predictive Analytics:

Forecast likely disaster-prone areas using historical data.
Custom Reports:

Generate comprehensive reports with charts, maps, and summaries.

/src/pages/About.tsx
6. About Us Page
Purpose: Explain the mission and vision behind CrisisGen.
Key Features:

A brief introduction to the team and the problem the project addresses.
Collaboration opportunities for NGOs, governments, and developers.
A section highlighting testimonials or case studies (if applicable).

/src/pages/Contact.tsx
7. Contact Us Page
Purpose: Allow users to get in touch for queries, feedback, or partnerships.
Key Features:

Contact Form:

Name, email, message, and category (general query, feedback, partnership).
Direct Contact Info:

Email, phone, and office address (if applicable).


# Feature Requirement
- we are creating the summary in the backend using genai. 
- There is a Backend folder that contains functionality for the summary and further more functionality is to be added.

# Current File Structure

CRISISGEN
│
├── .bolt
│
├── Backend
│   ├── venv
│   ├── .env
│   ├── app.py
│   └── requirements.txt
│
├── node_modules
│
└── src
    ├── components
    │   ├── Footer.tsx
    │   └── Navbar.tsx
    │
    └── pages
        ├── About.tsx
        ├── ActionPlan.tsx
        ├── Communication.tsx
        ├── Contact.tsx
        ├── Home.tsx
        ├── Dashboard.tsx
        └── Insights.tsx
    │
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── styles.css
    ├── vite-env.d.ts
    │
    ├── .gitignore
    ├── Instructions.md
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts