# Import necessary libraries
import os
import motor.motor_asyncio
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Original environment variable names
testing_mongo_uri = os.getenv("MONGODB_URI")  # Temporarily assigned for testing
testing_db_name = os.getenv("MONGODB_DB_NAME")  # Temporarily assigned for testing

# Set up MongoDB client using testing variables
client = motor.motor_asyncio.AsyncIOMotorClient(testing_mongo_uri)
database = client[testing_db_name]
events_collection = database.get_collection("event")

# Function to test MongoDB connection by fetching events
async def test_connection():
    async for event in events_collection.find():
        print(event)

# Run the async test connection function
import asyncio
asyncio.run(test_connection())
