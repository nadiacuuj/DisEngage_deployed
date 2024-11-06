# MongoDB Connection Setup:
#This file sets up a connection between FastAPI and MongoDB. 
# We load the URI and database name from .env using python-dotenv.

import motor.motor_asyncio # MongoDB async driver
import os # For accessing environment variables
from dotenv import load_dotenv # To load environment variables from .env

# Load variables from .env file
load_dotenv()

# Load environment variables from the .env file
load_dotenv()

# Retrieve MongoDB URI and database name from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME")

# Initialize MongoDB client and connect to the specified database
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client[DB_NAME]  # Access the 'PPDS' database
events_collection = database.get_collection("event")  # Collection for 'event' data within the database
