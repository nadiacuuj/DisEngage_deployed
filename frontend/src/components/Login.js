// Basic Login.js Component (for Testing)

// AI suggested: 
// To simulate navigation from the login page to other pages without implementing full OAuth: 
// Temporarily use a simple "login" action that redirects to the landing page when the button is clicked. 
// This way, you can proceed with building and testing the rest of your application even without OAuth.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6

const Login = () => {
  
  // AI suggested: Use useNavigate to simulate a successful login by navigating to the landing page when the button is clicked.  
  const navigate = useNavigate(); // useNavigate hook to control navigation

  // Temporary function to simulate login
  const handleLogin = () => {
    // Redirect to the landing page
    navigate('/landing');
  };

  return (
    <div className="page">
      <h1>Welcome to Evently</h1>
      <button className="oauth-button" onClick={handleLogin}>
        Log in with Google
      </button> {/* This button now simulates OAuth login */}
      <p className="placeholder-note">
        * Note: Google OAuth is not yet implemented. This button is a placeholder for testing.
        When ready, it will authorize your Google account to log in.
      </p> {/* Display message to indicate placeholder */}
    </div>
  );
};

export default Login;
