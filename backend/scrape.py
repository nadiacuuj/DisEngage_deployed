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

# Load environment variables from .env file
load_dotenv()

# MongoDB configuration
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME")

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
    count -= 1
    time.sleep(0.5)

# Find all event links on the page
soup = BeautifulSoup(driver.page_source, 'html.parser')
event_link_tags = soup.find_all("a", attrs={"style": 'text-decoration: none;'})
event_links = [tag['href'] for tag in event_link_tags if re.search(r'/event/(\d+)', tag['href'])]

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

                    categories = event_dict.get('categories', [])
                    category_array = [category['name'] for category in categories]

                    event_info = {
                        'id': event_dict['id'],
                        'name': event_dict['name'],
                        'startsOn': event_dict['startsOn'],
                        'endsOn': event_dict['endsOn'],
                        'venue': event_dict.get('address', {}).get('name', ''),
                        'theme': event_dict.get('theme', ''),
                        'categories': category_array,
                        'description': event_dict.get('description', ''),
                    }
                    
                    print(f'Parsed event ID: {event_info["id"]}')
                    events_data.append(event_info)
            else:
                print(f"Failed request for {full_url}, Status code: {response.status_code}")
        except Exception as e:
            print(f"Error occurred for {full_url}: {e}")
    
    return events_data

# Fetch event data from each event page
result = request_pages(event_links)

# Function to insert events into MongoDB
async def insert_events_to_mongo(events_data):
    # Clear the current events in the collection to avoid duplicates
    await events_collection.delete_many({})
    # Insert new events
    await events_collection.insert_many(events_data)
    print(f"Inserted {len(events_data)} events into MongoDB.")

# Run the MongoDB insertion
asyncio.run(insert_events_to_mongo(result))

# Quit the driver after scraping is complete
driver.quit()
