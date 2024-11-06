# FastAPI Application Entry Point:
# This file is the FastAPI app setup, containing: 
# 1) An API route to fetch events from MongoDB, and
# 2) An API route to scrape events from the Engage website and store them in MongoDB.

from fastapi import FastAPI  # FastAPI for building the API
from typing import List  # Type hint for list responses
from pydantic import BaseModel  # Base model for data validation
from database import events_collection  # MongoDB collection from database.py
from scrape import scrape_events  # Import the scraping function from scrape.py

# Initialize FastAPI application
app = FastAPI()

# Test root endpoint
@app.get("/")
async def root():
    return {"message": "Hello, world!"}  # Simple message to verify server is running

# Define an Event model with fields matching MongoDB structure
class Event(BaseModel):
    name: str  # Event name
    description: str  # Event description
    category: str  # Event category
    venue: str  # Event venue
    startTime: str  # Start time in ISO string format
    endTime: str  # End time in ISO string format
    createdAt: str  # Event creation time in ISO string format
    source: str  # Source of the event
    responseStatus: str = None  # Optional field for response status

    class Config:
        orm_mode = True  # Enable compatibility with MongoDB

# Route to get all events in the 'event' collection
@app.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetch all events stored in the MongoDB collection.
    """
    events = []  # Store retrieved events here
    async for event in events_collection.find():  # Iterate over all events in collection
        event["_id"] = str(event["_id"])  # Convert MongoDB ObjectId to string
        events.append(Event(**event))  # Convert MongoDB document to Event model
    return events  # Return list of events

# Route to scrape new events and store them in MongoDB
@app.post("/scrape-events")
async def scrape_and_store_events():
    """
    Scrape events from the website and store them in MongoDB.
    Clears existing events to avoid duplicates.
    """
    # Clear the current events in the collection to avoid duplicates
    await events_collection.delete_many({})
    
    # Scrape new events from the website
    scraped_events = scrape_events()  # Call the scrape_events function from scrape.py
    
    # Insert each scraped event into the MongoDB collection
    for event in scraped_events:
        await events_collection.insert_one(event)
    
    return {"message": "Events scraped and stored successfully", "event_count": len(scraped_events)}
