# DisEngage: An NYU Event Management Web App, unlike any other (contrary to popular belief)

DisEngage is a full-stack web application designed to streamline event exploration, scheduling, and engagement for NYU students, faculty, and staff, while also offering functionality for non-NYU users. Built with a React frontend and FastAPI backend, the platform allows all users to browse categorized event listings, view organization details, and explore event timings.

NYU-affiliated users gain additional functionality by logging in with their NYU email, such as the ability to add events to a shopping cart, integrate them with their existing calendar, and detect scheduling conflicts. Upon checking out, selected events are automatically imported into their Google Calendar, ensuring seamless scheduling. 

[Click here to visit the site](https://disengage-270035954698.us-central1.run.app/)

Recent updates include an organizer rating and review system, with future plans for a chat feature to foster event-related discussions.


## Features


![image](https://github.com/user-attachments/assets/c0c2ec45-c20f-4dad-8a00-e5177f0efcf1)

![image](https://github.com/user-attachments/assets/ca2e4225-f995-41ab-a98a-fa54685569a5)

![image](https://github.com/user-attachments/assets/6ee7ee09-23fa-47d6-9a32-7d0d7136296f)

![image](https://github.com/user-attachments/assets/4b4ad391-96e7-4200-b806-e0eb389fa815)

![image](https://github.com/user-attachments/assets/b0233ef7-e2b3-4325-9881-61756c2c5bad)

![image](https://github.com/user-attachments/assets/3667d3b8-bfdb-4073-8385-65ee83441925)

![image](https://github.com/user-attachments/assets/cd8dd298-5496-4ee6-82e2-4b609c04fdda)

![image](https://github.com/user-attachments/assets/f5378255-c3ef-480a-b640-1b7fb31f5aaf)

![image](https://github.com/user-attachments/assets/7c9c0fdb-6453-4ebc-918d-135dc02690d2)









### Current Functionality

- **User Authentication**: Supports Google OAuth for login.
- **Event Exploration**: Browse events by category, add to a personalized event cart, and check for scheduling conflicts.
- **Schedule Review**: Visual calendar to manage events and detect overlaps.
- **Rating and Review System**: Users can rate organizers and leave feedback, helping others choose events based on organizer quality.
- **Backend API**: Includes endpoints for retrieving event data, submitting reviews, and dynamically scraping events from NYU Engage.

### Planned Features

- **Event Chat**: A feature for attendees to discuss event details, such as dietary options and accessibility.


## Wireframe Overview


The DisEngage UI wireframe, designed in Figma, outlines key pages and flows:
- **Login**: Simple page for Google OAuth (future integration).
- **Landing Page**: Welcome page with access to event categories.
- **Category Page**: Displays events sorted by category, allowing users to explore various event types.
- **Schedule Review**: Visual calendar view to help users organize their events.
- **Cart Page**: Shows selected events, detecting scheduling conflicts if they overlap.
- **Event Review Page**: Users can rate and review organizers.

Wireframe link: [DisEngage Wireframe](https://www.figma.com/design/MasSlMeRXTZXFJKS1GPhe0/PPDS---wireframe?node-id=0-1&t=kliAEk92ZPicklHd-1)


## API Endpoints

- **GET /api/events**: Retrieves categorized event listings.
- **POST /api/reviews**: Submits reviews and ratings for events or organizers.
- **GET /api/organizers/{id}/ratings**: Fetches rating data for a specific organizer.

---

## Local Setup

Follow these steps to set up the frontend and backend locally, enabling you to explore the DisEngage interface with the pre-scraped data.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DisEngage
```

### 2. Configure Environment Variables

Create a .env file in the root directory with the following variables:
```bash
# backend variables
MONGODB_URI=mongodb+srv://<username>:<password>@projects-in-programming.qctmw.mongodb.net/?retryWrites=true&w=majority&appName=Projects-In-Programming
MONGODB_DB_NAME=ProjectDB
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/callback

# frontend variables
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_API_BASE_URL=https://disengage-backend-270035954698.us-central1.run.app/api
```

### Obtaining Google Client ID and Google Client Secret

To integrate Google OAuth into your application, follow these steps to obtain your Google Client ID and Google Client Secret:

1. **Go to the Google Cloud Console**: Visit [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a New Project**

3. **Create Credentials**:

   - Go to "APIs & Services" > "Credentials."

   - Click on "Create Credentials" and select "OAuth client ID."

   - If prompted, configure the consent screen by providing the necessary information.

   - Choose "Web application" as the application type.

   - Add your authorized redirect URIs (e.g., `http://localhost:3000/callback`).

4. **Get Your Client ID and Client Secret**

### 3. Backend Setup

create a virtual environment in the root directory, install dependencies, and activate it:
```bash
python -m venv .venv

.venv\Scripts\activate # On Windows use .venv\Scripts\activate
source .venv/bin/activate # On macOS and Linux:

pip install -r backend/requirements.txt
```

### 4. Run the Backend Server
Start the FastAPI server to serve the API on http://localhost:8000:

```bash
uvicorn main:app --reload
```
or
```
python3 -m uvicorn main:app --reload
```

### 5. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the React application:

```bash
cd ../frontend
npm install
npm start
```

## Scraping
In the scrape.py file, adjust the X in count -= X to scrape a portion or all events.

```python

#make count -= 1 to capture all events!
    while count > 0:
        load_more()
        count -= 10
        time.sleep(0.5)
```

