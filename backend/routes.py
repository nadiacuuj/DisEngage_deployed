# MongoDB Connection Setup:
#This file sets up a connection between FastAPI and MongoDB. 
# We load the URI and database name from .env using python-dotenv.

import motor.motor_asyncio # MongoDB async driver
import os # For accessing environment variables
from dotenv import load_dotenv # To load environment variables from .env
from fastapi import APIRouter, HTTPException, Body, Request, Response, HTTPException, status
from models import Event, EventUpdate
from typing import List


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
# @router.get("/events", response_model=List[Event])
# async def get_events():
#     """
#     Fetch all events stored in the MongoDB collection.
#     """
#     events = []  # Store retrieved events here
#     async for event in events_collection.find():  # Iterate over all events in collection
#         event["_id"] = str(event["_id"])  # Convert MongoDB ObjectId to string
#         events.append(Event(**event))  # Convert MongoDB document to Event model
#     return events  # Return list of events

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
