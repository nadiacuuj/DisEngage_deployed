# Evently - An NYU Event Management Web App

**Evently** aims to (hopefully) be a web application that will streamline event exploration and scheduling for NYU students, faculty, and staff. The frontend, developed in React, displays categorized event listings, manages a personalized event cart, and features a schedule review tool to avoid overlap. 

### Wireframe Overview

The Evently UI wireframe, designed in Figma, outlines key pages and flows:
- **Login**: Simple page for Google OAuth (future integration).
- **Landing Page**: Welcome page with access to event categories.
- **Category Page**: Displays events sorted by category, allowing users to explore various event types.
- **Cart Page**: Shows selected events, detecting scheduling conflicts if they overlap.
- **Schedule Review**: Visual calendar view to help users organize their events.

See the full wireframe on Figma: [Evently Wireframe](https://www.figma.com/design/MasSlMeRXTZXFJKS1GPhe0/PPDS---wireframe?node-id=0-1&t=kliAEk92ZPicklHd-1)

### Current Functionality and Future Goals

For now, the frontend fetches event data from a pre-scraped CSV file to test out components and design interactions. The ultimate goal is to seamlessly integrate the backend API with MongoDB, so new events from NYU Engage are dynamically scraped, stored, and served to the frontend, keeping the event listings fresh and updated in real-time.

---

## Local Setup

Follow these steps to set up the frontend and backend locally, enabling you to explore the Evently interface with the pre-scraped data.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NYU_Events_FrontEnd_Setup/frontend
```

### 2. Configure Environment Variables

Create a .env file in the backend directory with the following variables:
```bash
cd backend

MONGODB_URI="mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority"
MONGODB_DB_NAME="PPDS"
REACT_APP_API_BASE_URL="http://localhost:8000"
```

### 3. Backend Setup

Navigate to the backend directory, create a virtual environment, install dependencies, and activate it:
```bash
python -m venv .venv

.venv\Scripts\activate # On Windows use .venv\Scripts\activate
source .venv/bin/activate # On macOS and Linux:
```

### 4. Run the Backend Server
Start the FastAPI server to serve the API on http://localhost:8000:

```bash
uvicorn main:app --reload
```

### 5. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the React application:

```bash
cd ../frontend
npm install
npm start
```

