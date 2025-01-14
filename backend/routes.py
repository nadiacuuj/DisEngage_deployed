# MongoDB Connection Setup:
#This file sets up a connection between FastAPI and MongoDB. 
# We load the URI and database name from .env using python-dotenv.

import motor.motor_asyncio # MongoDB async driver
import os # For accessing environment variables
from dotenv import load_dotenv # To load environment variables from .env
from fastapi import APIRouter, HTTPException, Body, Request, Response, HTTPException, Depends
from models import Event, User
from typing import List
from jose import jwt, JWTError
import requests
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from datetime import datetime, timezone, timedelta 
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from bs4 import BeautifulSoup

# Load variables from .env file
load_dotenv()


# Retrieve MongoDB URI and database name from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME")

# Initialize MongoDB client and connect to the specified database
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client[DB_NAME]  # Access the 'PPDS' database
events_collection = database.get_collection("event")  # Collection for 'event' data within the database
users_collection = database.get_collection("users")

router = APIRouter()

# Test root endpoint
@router.get("/")
async def root():
    return {"message": "Hello, world!"}  # Simple message to verify server is running

# # Route to get all events in the 'event' collection
@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetch all events stored in the MongoDB collection.
    """
    events = []  # Store retrieved events here
    async for event in events_collection.find():  # Iterate over all events in collection
        if "_id" in event and isinstance(event["_id"], str):
            event["_id"] = ObjectId(event["_id"])
        events.append(Event(**event))  # Convert MongoDB document to Event model
    return events  # Return list of events

#UPDATING USER ENGAGE EVENTS
class UpdateEngageEventsRequest(BaseModel):
    token: str
    event_ids: List[str]


@router.get("/oneEvent")
async def get_one_event(request: Request):
    event_id = request.headers.get("EventId")

    print(f'EVENT ID: {event_id}')   

    event = await events_collection.find_one({"engage_id": int(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return event



@router.post("/updateEngageEvents")
async def update_engage_events(request: UpdateEngageEventsRequest):
    try:
        print(f"Token received: {request.token}")
        print(f"event_ids: {request.event_ids}")
        # token_decoded = jwt.decode(request.token, GOOGLE_CLIENT_SECRET, algorithms=["HS256"])
        google_id = request.token
        # print(f"Decoded Token: {token_decoded}")
    except JWTError as e:
        print(f"JWT Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid token")
    
    found_user = users_collection.find_one({"google_id": google_id})
    if not found_user:
        raise Exception("User not found")

    users_collection.update_one({"google_id": google_id}, {"$addToSet": {"engage_events": {'$each': request.event_ids}}})

    return {"Response": "Updated user engage evens successfully"}


#GET USER INFO FOR CART
@router.get("/getUserInfo")
async def get_user_info(request: Request):
    token = request.headers.get("Authorization")
    print(token)
    if token is None or not token.startswith("Bearer "):
        print("ERROR 1")
        raise HTTPException(status_code=400, detail="Token missing or malformed")
    token = token[7:]  # Remove "Bearer " prefix
    
    # Find the user by google_id in the database
    user_info = await users_collection.find_one({"google_id": token})
    print(user_info)
    if not user_info:
        print("ERROR 3")
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = {
        "google_id": user_info["google_id"],
        "email": user_info["email"],
        "name":user_info["name"],
        "last_login":user_info['last_login'],
        'engage_events': user_info['engage_events'],
        'google_events': user_info['google_events']
    }
    
    # Return the full user information
    print("FINAL STAGE GOOD")
    return user_data  # This will return the whole user document as the response


#DELETE ENGAGE EVENTS FROM USER
@router.post("/clearEngageEvents")
async def get_user_info(token: str):
    try:
        decoded_token = jwt.decode(token, GOOGLE_CLIENT_SECRET, algorithms=["HS256"])
        google_id = decoded_token["google_id"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    # Find the user by google_id in the database
    user = users_collection.find_one({"google_id": google_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Clear the engage_events list
    users_collection.update_one(
        {"google_id": google_id},
        {"$set": {"engage_events": []}}  # Set the engage_events field to an empty array
    )
    
    return {"detail": "User engage_events list cleared successfully"}

now = datetime.now(timezone.utc)
# Get start date (3 months ago)
three_months_ago = now - timedelta(days=90)
# Get end date (3 months from now)
three_months_later = now + timedelta(days=90)

# Convert to ISO format and replace "+00:00" with "Z"
timeMin = three_months_ago.isoformat().replace("+00:00", "Z")
timeMax = three_months_later.isoformat().replace("+00:00", "Z")

@router.get("/getGoogleCalendar")
async def get_google_calendar(request: Request):
    # Extract the Authorization token
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token missing or malformed")
    token = token[7:]  # Remove "Bearer " prefix

    # Get user info to access their access_token
    user_info = await users_collection.find_one({"google_id": token})
    if not user_info:
        raise HTTPException(status_code=404, detail="User not found")
    
    try: 
        response = requests.get(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            headers={"Authorization": f"Bearer {user_info['access_token']}"},
            params={
                "calendarId": "primary",
                "maxResults": 2500,
                "singleEvents": True,
                "orderBy": "startTime",
                "timeMin": timeMin,
                "timeMax": timeMax,
            },
        )
        response.raise_for_status()
        events = response.json().get("items", [])
        
        if not events:
            return {"events": [], "message": "No upcoming events found."}

        # Format events and filter out all-day Office/Home events
        formatted_events = [
            {
                "start": event["start"].get("dateTime", event["start"].get("date")),
                "end": event["end"].get("dateTime", event["end"].get("date")),
                "summary": event.get("summary", "No title"),
                "event_id": event.get("id", ""),
                "source": "google_calendar"
            } 
            for event in events
            if not (
                # Skip if it's an all-day Office/Home event
                event["start"].get("date") and  # Has date (all-day) instead of dateTime
                event.get("summary", "").lower() in ["office", "home"]  # Case-insensitive check
            )
        ]

        return {
            "events": formatted_events,
            "message": "Calendar events fetched successfully"
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch calendar events: {str(e)}")


# # Route to scrape new events and store them in MongoDB
# @app.post("/scrape-events")
# async def scrape_and_store_events():
#     """
#     Scrape events from the website and store them in MongoDB.
#     Clears existing events to avoid duplicates.
#     """
#     # Clear the current events in the collection to avoid duplicates
#     await events_collection.delete_many({})
    
#     # Scrape new events from the website
#     scraped_events = scrape_events()  # Call the scrape_events function from scrape.py
    
#     # Insert each scraped event into the MongoDB collection
#     for event in scraped_events:
#         await events_collection.insert_one(event)
    
#     return {"message": "Events scraped and stored successfully", "event_count": len(scraped_events)}
class GoogleAuthRequest(BaseModel):
    code: str

# Add these environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/login/google")
async def login_google():
    # Add calendar.readonly to the scope
    scopes = [
        "openid",
        "profile", 
        "email",
        "https://www.googleapis.com/auth/calendar"


    ]
    scope_string = "%20".join(scopes)
    
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope={scope_string}&access_type=offline"
    }

@router.post("/auth/google")
async def auth_google(request: GoogleAuthRequest):  # Use Pydantic model to validate request body
    print("Received request:", request)  # Debug log
    
    token_url = "https://accounts.google.com/o/oauth2/token"
    data = {
        "code": request.code,  # Access code from request body
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": "http://localhost:3000/callback",
        "grant_type": "authorization_code",
    }
    print("Token request data:", data)  # Debug log
    
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    print(access_token)
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    print(user_info.json())
    user_info_j = user_info.json()

    user_data = User(
        google_id=user_info_j["id"],
        access_token=access_token,
        email=user_info_j["email"],
        name=user_info_j["name"],
        last_login=datetime.now(timezone.utc),
        engage_events=[],
        google_events=[]
    )

    users_collection.update_one(
        {'google_id': user_data.google_id}, 
        {'$set': user_data.model_dump(exclude={"id"})}, 
        upsert=True
    )

    # payload = {
    #     "access_token": access_token,
    #     "google_id": user_info_j["id"]
    # }
    # token = jwt.encode(payload, GOOGLE_CLIENT_SECRET, algorithm="HS256")

    # Step 5: Return the token
    
    return {"id": user_data.google_id}


@router.get("/token")
async def get_token(token: str = Depends(oauth2_scheme)):
    return jwt.decode(token, GOOGLE_CLIENT_SECRET, algorithms=["HS256"])

@router.post("/storeFilteredGoogleEvents")  # Changed to POST
async def store_filtered_google_events(request: Request):
    # Extract the Authorization token
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token missing or malformed")
    token = token[7:]  # Remove "Bearer " prefix

    # Get user info
    user_info = await users_collection.find_one({"google_id": token})
    if not user_info:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Get filtered events from request body
        body = await request.json()
        filtered_events = body.get("filteredEvents", [])
        
        # Update user's google_events array with only the filtered events
        await users_collection.update_one(
            {"google_id": token},
            {"$set": {"google_events": filtered_events}}
        )

        return {
            "message": "Filtered calendar events stored successfully",
            "events": filtered_events
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store filtered events: {str(e)}")

@router.post("/addToGoogleCalendar")
async def add_to_google_calendar(request: Request):
    # Extract the Authorization token and event ID
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token missing or malformed")
    token = token[7:]  # Remove "Bearer " prefix

    # Get event ID from request body
    body = await request.json()
    event_id = body.get("event_id")
    if not event_id:
        raise HTTPException(status_code=400, detail="Event ID is required")

    # Get user info to verify token
    user_info = await users_collection.find_one({"google_id": token})
    if not user_info:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Get event details from MongoDB
        event = await events_collection.find_one({"engage_id": int(event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        # Create Google Calendar credentials
        creds = Credentials(
            token=user_info['access_token']
        )

        # Build Google Calendar service
        service = build('calendar', 'v3', credentials=creds)

        # Format event for Google Calendar
        google_event = {
            'summary': event['name'],
            'description': BeautifulSoup(event['description'], 'html.parser').get_text(),
            'start': {
                'dateTime': event['startTime'].isoformat(),
                'timeZone': 'America/New_York',
            },
            'end': {
                'dateTime': event['endTime'].isoformat(),
                'timeZone': 'America/New_York',
            },
            'location': event['venue']
        }

        # Insert event to Google Calendar
        created_event = service.events().insert(
            calendarId='primary',
            body=google_event
        ).execute()

        return {
            "message": "Event added to Google Calendar successfully",
            "google_event_id": created_event['id']
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add event to Google Calendar: {str(e)}")

@router.delete("/deleteGoogleEvent/{event_id}")
async def delete_google_event(event_id: str, request: Request):
    # Extract the Authorization token
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token missing or malformed")
    token = token[7:]  # Remove "Bearer " prefix

    # Get user info to access their access_token
    user_info = await users_collection.find_one({"google_id": token})
    if not user_info:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Create Google Calendar credentials
        creds = Credentials(
            token=user_info['access_token']
        )

        # Build Google Calendar service
        service = build('calendar', 'v3', credentials=creds)

        # Delete the event from Google Calendar
        service.events().delete(
            calendarId='primary',
            eventId=event_id
        ).execute()

        # Remove the event from user's google_events array
        users_collection.update_one(
            {"google_id": token},
            {"$pull": {"google_events": {"event_id": event_id}}}
        )

        return {"message": "Event deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete event from Google Calendar: {str(e)}")

@router.delete("/deleteEngageEvent/{event_id}")
async def delete_engage_event(event_id: str, request: Request):
    # Extract the Authorization token
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token missing or malformed")
    token = token[7:]  # Remove "Bearer " prefix

    # Get user info
    user_info = await users_collection.find_one({"google_id": token})
    if not user_info:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Add 'await' here for the async operation
        result = await users_collection.update_one(
            {"google_id": token},
            {"$pull": {"engage_events": event_id}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Event not found in user's engage events")

        return {"message": "Event removed successfully from engage events"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove event: {str(e)}")