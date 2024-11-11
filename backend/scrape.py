#  This script scrapes event data from NYU Engage and updates our MongoDB database with the latest events.

import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import re
import json
import motor.motor_asyncio
import asyncio
from models import Event
from datetime import datetime, timezone
from urllib.parse import quote_plus
# Load environment variables from .env file

# Function to insert events into MongoDB
async def insert_events_to_mongo():
    print("Starting scraping process...")
    load_dotenv()

    # MongoDB configuration
    MONGODB_URI = os.getenv('MONGODB_URI')
    DB_NAME = os.getenv('MONGODB_DB_NAME')

# MongoDB URI

    # Initialize MongoDB client
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
    database = client[DB_NAME]
    events_collection = database.get_collection("event")

    # Initialize a Chrome WebDriver instance to interact with the website
    driver = webdriver.Chrome()
    driver.get("https://engage.nyu.edu/events")
    time.sleep(2)  # Pause to allow the page to load

    # Get the total count of events on the page
    events_count_soup = BeautifulSoup(driver.page_source, 'html.parser')
    all_events_count = events_count_soup.find("div", attrs={"style": "color: rgb(73, 73, 73); margin: 15px 0px 0px; font-style: italic; text-align: left;"})
    match = re.search(r"\d{4}", all_events_count.text)
    all_events_count_number = int(match.group()) if match else 0
    count = (all_events_count_number // 15) + 1

    # Function to load more events
    def load_more():
        try:
            load_more_button = driver.find_element(By.CSS_SELECTOR, "div.outlinedButton > button")
            driver.execute_script("arguments[0].click();", load_more_button)
            return True
        except Exception as e:
            print(f"Failed to click next button: {e}")
            return False

    # Load additional events by clicking the "Load more" button
    while count > 0:
        load_more()
        count -= 10
        time.sleep(0.5)

    # Find all event links on the page
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    event_link_tags = soup.find_all("a", attrs={"style": 'text-decoration: none;'})
    event_links = [tag['href'] for tag in event_link_tags if re.search(r'/event/(\d+)', tag['href'])]

    def transform_event_data(event_dict):
        categories = event_dict.get('categories', [])
        category_array = [category['name'] for category in categories]

        # Map the data to the Event schema fields and transform datetime formats
        event_data = {
            "engage_id": event_dict.get('id'),
            "name": event_dict.get('name'),
            "startTime": datetime.fromisoformat(event_dict.get('startsOn')),
            "endTime": datetime.fromisoformat(event_dict.get('endsOn')),
            "createdAt": datetime.now(timezone.utc),  # Use the current time for createdAt
            "source": "NYU Engage",  # Static source
            "description": event_dict.get('description', ''),
            "category": category_array,
            "venue": event_dict.get('address', {}).get('name', ''),
            "responseStatus": None  # Default if not provided
        }

        return Event(**event_data)

    # Define a function to request each event page and extract data
    def request_pages(links):
        base_url = "https://engage.nyu.edu"
        events_data = []

        for link in links:
            full_url = base_url + link
            try:
                response = requests.get(full_url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    script_tag = soup.find('script', string=re.compile(r'window\.initialAppState'))

                    if script_tag:
                        script_content = script_tag.string.strip()
                        start_index = script_content.find('{')
                        end_index = script_content.rfind('}')
                        json_str = script_content[start_index:end_index+1]

                        dict_data = json.loads(json_str)
                        event_dict = dict_data["preFetchedData"]['event']

                        event_info = transform_event_data(event_dict)

                        print(f'Parsed event ID: {event_info.engage_id}')
                        events_data.append(event_info.model_dump(by_alias=True))
                else:
                    print(f"Failed request for {full_url}, Status code: {response.status_code}")
            except Exception as e:
                print(f"Error occurred for {full_url}: {e}")

        return events_data

    # Fetch event data from each event page
    result = request_pages(event_links)
    # Quit the driver after scraping is complete
    driver.quit()
    # Clear the current events in the collection to avoid duplicates
    await events_collection.delete_many({})
    # Insert new events
    await events_collection.insert_many(result)
    print(f"Inserted {len(result)} events into MongoDB.")

