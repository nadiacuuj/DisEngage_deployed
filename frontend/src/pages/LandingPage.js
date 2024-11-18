// Main Landing Page Component:
// This component is the main page after logging in, with buttons to navigate to other parts of the app.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6

const LandingPage = () => {
  const navigate = useNavigate(); // useNavigate is a React hook to handle navigation (when each button is clicked)

  return (
    <div className="page">
      <h2>Welcome to Evently</h2> {/* Welcome message */}
      <button onClick={() => navigate('/oauth')}>Navigate to NYU Engage</button> {/* Button to navigate to OAuth page */}
      <button onClick={() => navigate('/categories')}>Search by Category</button> {/* Button to navigate to category page */}
    </div>
  );
};

export default LandingPage;
