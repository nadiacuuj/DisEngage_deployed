# MongoDB Connection Setup:
#This file sets up a connection between FastAPI and MongoDB. 
# We load the URI and database name from .env using python-dotenv.

import motor.motor_asyncio # MongoDB async driver
import os # For accessing environment variables
from dotenv import load_dotenv # To load environment variables from .env
from fastapi import APIRouter, HTTPException, Body, Request, Response, HTTPException, Depends
from models import Event, EventUpdate
from typing import List
from jose import jwt
import requests
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId

# Load variables from .env file
load_dotenv()


# Retrieve MongoDB URI and database name from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME")

# Initialize MongoDB client and connect to the specified database
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client[DB_NAME]  # Access the 'PPDS' database
events_collection = database.get_collection("event")  # Collection for 'event' data within the database

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
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline"
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
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    return user_info.json()

@router.get("/token")
async def get_token(token: str = Depends(oauth2_scheme)):
    return jwt.decode(token, GOOGLE_CLIENT_SECRET, algorithms=["HS256"])
