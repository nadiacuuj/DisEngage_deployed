// Fetching Data from Backend:
// This component displays event categories fetched from the backend.

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // State to hold categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Make GET request to fetch events from backend
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events`);
        
        // Extract unique categories from events
        const events = response.data; // Access the array of event objects
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
    </div>
  );
};

export default CategoryPage;
