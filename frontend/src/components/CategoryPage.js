// Fetching Data from Backend:
// This component displays event categories fetched from the backend.

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // State to hold categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Make GET request to fetch categories from backend
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/categories`);
        setCategories(response.data);  // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);  // Handle errors
      }
    };

    fetchCategories();  // Call function when component mounts
  }, []);

  return (
    <div className="page">
      <h3>Category List</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category.name}</li>  // Render each category as a list item
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
