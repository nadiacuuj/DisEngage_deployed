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
        const uniqueCategories = [...new Set(events.map(event => event.category).filter(Boolean))];
        
        setCategories(uniqueCategories); // Update state with unique categories
      } catch (error) {
        console.error("Error fetching categories:", error); // Handle errors
      }
    };

    fetchCategories(); // Call function when component mounts
  }, []);



  return (
    <div className="page">
      <h3>Category List</h3>
      <div className="category-list">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <button key={index} className="category-button">
              {category} {/* Render each category as a button */}
            </button>
          ))
        ) : (
          <p>No categories available</p> // Display message if no categories found
        )}
      </div>
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.name}</h3>
            <p><strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}</p>
            <p><strong>Source:</strong> {event.source}</p>
            <p><strong>Description:</strong> {event.description || "No description available"}</p>
            <p><strong>Category:</strong> {event.category ? event.category.join(', ') : "Uncategorized"}</p>
            <p><strong>Venue:</strong> {event.venue || "Venue not specified"}</p>
            <p><strong>Response Status:</strong> {event.responseStatus || "No response status"}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
