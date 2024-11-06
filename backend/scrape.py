# This script performs the web scraping of NYU Engage and returns a structured list of events.

import requests
from bs4 import BeautifulSoup

def scrape_events():
    url = "https://engage.nyu.edu"  # Replace with the actual URL for scraping
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    events = []
    # Customize based on actual HTML structure of the site
    for event in soup.select(".event-class"):  # Adjust selector to match actual HTML
        event_name = event.select_one(".event-name").text.strip()
        category = event.select_one(".event-category").text.strip()
        start_time = event.select_one(".start-time").text.strip()
        end_time = event.select_one(".end-time").text.strip()
        location = event.select_one(".event-location").text.strip()

        events.append({
            "event_name": event_name,
            "category": category,
            "start_time": start_time,
            "end_time": end_time,
            "location": location
        })

    return events
