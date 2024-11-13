# FastAPI Application Entry Point:
# This file is the FastAPI app setup, containing: 
# 1) An API route to fetch events from MongoDB, and
# 2) An API route to scrape events from the Engage website and store them in MongoDB.

from fastapi import FastAPI  # FastAPI for building the API
from pymongo import MongoClient
from typing import List  # Type hint for list responses
from pydantic import BaseModel  # Base model for data validation
from routes import router  # MongoDB collection from database.py
from scrape import insert_events_to_mongo
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
from dotenv import load_dotenv # To load environment variables from .env
from urllib.parse import quote_plus
from datetime import datetime
import os
import certifi
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Get MongoDB credentials
MONGODB_URI = os.getenv('MONGODB_URI')
DB_NAME = os.getenv('MONGODB_DB_NAME')

# Initialize FastAPI application with lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Set up MongoDB client and database
    app.mongodb_client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
    app.database = app.mongodb_client[DB_NAME]
    print("Connected to MongoDB!")


    # Set up the scheduler and start the daily job
    scheduler = AsyncIOScheduler(timezone="America/New_York")
    scheduler.add_job(insert_events_to_mongo, "interval", days=1, next_run_time=datetime.now())
    scheduler.start()
    print("Scheduler started with a daily scraping job.")

    # Yield control back to FastAPI for the application lifecycle
    yield

    # Shutdown resources upon application shutdown
    scheduler.shutdown()
    app.mongodb_client.close()
    print("Disconnected from MongoDB and stopped the scheduler.")

#app = FastAPI(lifespan=lifespan)  # Pass the lifespan context to FastAPI
app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include the API router
app.include_router(router, prefix="/api", tags=["api"])