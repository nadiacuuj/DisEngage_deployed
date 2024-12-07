import CategorySelect from "../component/CategorySelect";
import EventCard from "../component/EventCard";
import Navigationbar from "../component/NavigationBar";
// Fetching Data from Backend:
// This component displays event categories fetched from the backend.
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // State to hold categories
  const [events, setEvents] = useState([]);
  const uri = process.env.REACT_APP_API_BASE_URL + '/api'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Make GET request to fetch events from backend
        const eventsUri = uri + '/events'
        const response = await axios.get(`http://127.0.0.1:8000/api/events`);
        
        // Extract unique categories from events
        const events = response.data; // Access the array of event objects
        setEvents(events);
        console.log(events);
        console.log(events[0]);
        // const uniqueCategories = [...new Set(events.map(event => event.category).filter(Boolean))]
        // .map((category, index) => ({ id: index + 1, name: category }));

        const uniqueCategories = [
          ...new Set(
            events
              .flatMap(event => event.category) // Flatten all categories into a single array
              .filter(Boolean) // Remove null or undefined categories, if any
          )
        ].map((category, index) => ({ id: index + 1, name: category }));
        
        setCategories(uniqueCategories); // Update state with unique categories

      } catch (error) {
        console.error("Error fetching categories:", error); // Handle errors
      }
    };
    fetchCategories(); // Call function when component mounts
  }, []);

  return (
      <div>
        <Navigationbar />
        <div class="flex w-screen mt-5">
            <div class="mx-8 pl-8" >
                <CategorySelect categories={categories}/>
            </div>
            <div class="w-3/4 mr-8 flex flex-wrap gap-y-6 gap-x-4 justify-center">
                {events.map((event) => (
                <div>
                    <EventCard eventKey={event.engage_id} event={event}/>
                </div>
                ))}  
            </div>

        </div>
    </div>
    )
};


export default CategoryPage
