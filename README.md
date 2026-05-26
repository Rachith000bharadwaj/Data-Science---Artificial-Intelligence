# Artificial Intelligence Project: KSRTC Transport Intelligence System

This repository contains an Artificial Intelligence project built around KSRTC transport data. The project combines data collection, data preparation, machine learning, REST API development, and two web interfaces for transport administrators and commuters.

The main goal is to use AI and data-driven techniques to support better bus route analysis, fare prediction, traffic/speed understanding, schedule exploration, and commuter-facing route information.

## Project Overview

Public transport systems generate large amounts of operational data such as route details, fare information, travel distance, schedules, and traffic-related signals. This project demonstrates how that data can be processed and used to build an intelligent transport platform.

The project is organized as an end-to-end pipeline:

1. Data collection and preparation using Apache Spark.
2. AI/ML model development using Spark MLlib and Python tools.
3. REST API integration using Flask.
4. Admin dashboard for analysis, prediction, route management, and optimization.
5. Commuter application for route lookup and travel-facing features.

## Key Features

- KSRTC route and transport data processing.
- Apache Spark based data preparation workflow.
- Machine learning notebooks for fare and traffic/speed prediction.
- Flask backend API for connecting the models/data with frontend apps.
- Admin dashboard built with Next.js, React, Tailwind CSS, Leaflet maps, and Recharts.
- Commuter-facing Next.js app for route and journey information.
- Project report, overview document, presentation, and contribution distribution document.

## Repository Structure

```text
.
├── KSRTC_Project_Submission/
│   ├── 1.Jupyter Notebooks/
│   │   ├── 1.Data collection with apache spark.ipynb
│   │   ├── 2.Data preparation with apache spark.ipynb
│   │   ├── 3.AI Model Development with Spark MLlib.ipynb
│   │   ├── 4.Rest APi Integration with Flask.ipynb
│   │   ├── cleaned_ksrtc_data.parquet/
│   │   ├── ksrtc_fare_prediction_model/
│   │   └── ksrtc_traffic_speed_model/
│   ├── 2.Backend/
│   │   ├── app.ipynb
│   │   ├── ksrtc.csv
│   │   ├── python rest_api_with_ksrtc_routes.ipynb
│   │   └── requirements.txt
│   └── 3.Frontend/
│       ├── 1.ksrtc-admin/
│       └── 2.commuter-app/
├── Overview.pdf
├── Report.pdf
├── PPT.pptx
├── Part Distribution.docx
└── .gitignore
```

## Main Components

### 1. Jupyter Notebooks

The notebooks show the project workflow from raw data handling to AI model development:

- **Data collection with Apache Spark**: loads and organizes KSRTC-related data.
- **Data preparation with Apache Spark**: cleans, transforms, and prepares the dataset for modeling.
- **AI Model Development with Spark MLlib**: builds predictive models for transport-related outcomes.
- **REST API Integration with Flask**: connects processed data and model outputs with backend API logic.

The folder also contains generated model artifacts such as fare prediction and traffic/speed model directories.

### 2. Backend

The backend is based on Flask and Python. It is intended to expose project data and model logic through REST APIs that can be consumed by the frontend applications.

Important backend technologies:

- Flask
- Flask-CORS
- PySpark
- Pandas
- NumPy
- Scikit-learn
- MLflow
- Prometheus client

Install backend dependencies:

```bash
cd "KSRTC_Project_Submission/2.Backend"
pip install -r requirements.txt
```

The backend work is currently provided mainly through notebooks, including API integration work and the KSRTC route dataset used by the apps.

### 3. Admin Dashboard

The admin dashboard is located at:

```text
KSRTC_Project_Submission/3.Frontend/1.ksrtc-admin
```

It is a Next.js application for administrative transport analysis and management. The app includes pages for:

- Analytics
- Route management
- Prediction
- Optimization
- Scheduling
- History
- Settings
- Map-based visualization

Run the admin dashboard:

```bash
cd "KSRTC_Project_Submission/3.Frontend/1.ksrtc-admin"
npm install
npm run dev
```

### 4. Commuter App

The commuter-facing application is located at:

```text
KSRTC_Project_Submission/3.Frontend/2.commuter-app
```

It is a Next.js application focused on public-facing route and journey information. It includes pages/components for:

- Home page
- Route lookup
- Journey tracking
- Navigation bar
- Journey map
- Footer

Run the commuter app:

```bash
cd "KSRTC_Project_Submission/3.Frontend/2.commuter-app"
npm install
npm run dev
```

## Technologies Used

### Data and AI

- Python
- Apache Spark
- PySpark
- Spark MLlib
- Pandas
- NumPy
- Scikit-learn
- MLflow

### Backend

- Flask
- Flask-CORS
- REST API design
- JSON-based API communication

### Frontend

- Next.js
- React
- Tailwind CSS
- Axios
- Leaflet / React Leaflet
- Recharts
- Lucide React icons

The repository includes the lightweight project files needed to understand the project structure, notebooks, backend, frontend source code, report, overview, and presentation.

## Documentation Files

- `Overview.pdf`: high-level project overview.
- `Report.pdf`: project report.
- `PPT.pptx`: presentation deck.
- `Part Distribution.docx`: team/work distribution document.

## Expected Workflow

1. Review the overview and report documents.
2. Open the Jupyter notebooks in order to understand data collection, preparation, AI model development, and API integration.
3. Install backend requirements if running the Python/Flask side.
4. Start either frontend application depending on the user role:
   - Admin dashboard for transport management and analytics.
   - Commuter app for route and journey-facing features.

## Project Purpose

This project is a practical AI system prototype for public transport intelligence. It demonstrates how transport data can be transformed into useful predictions, dashboards, and commuter services through a combination of big data processing, machine learning, backend APIs, and modern web applications.

