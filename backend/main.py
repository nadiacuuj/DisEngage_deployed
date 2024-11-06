# FastAPI Application Entry Point:
# This file contains the FastAPI app setup and an API route to fetch events from MongoDB.

from fastapi import FastAPI # FastAPI for building the API
from typing import List # Type hint for list responses
from pydantic import BaseModel # Base model for data validation
from database import events_collection # MongoDB collection from database.py

# Initialize FastAPI application
app = FastAPI()

# Define an Event model with required fields
class Event(BaseModel):
    name: str # Event name
    start_time: str # Start time in string format
    end_time: str # End time in string format

# Route to get all events in the 'event' collection
@app.get("/events", response_model=List[Event])
async def get_events():
    events = [] # Store retrieved events here
    async for event in events_collection.find(): # Iterate over all events in collection
        events.append(Event(**event)) # Convert MongoDB document to Event model
    return events # Return list of events
