// Basic Login.js Component (for Testing)

// AI suggested: 
// To simulate navigation from the login page to other pages without implementing full OAuth: 
// Temporarily use a simple "login" action that redirects to the landing page when the button is clicked. 
// This way, you can proceed with building and testing the rest of your application even without OAuth.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6

const Login = () => {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  let isRequestInProgress = false;

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRequestInProgress) return;

    isRequestInProgress = true;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;

    // Reset the flag after a delay to allow navigation
    setTimeout(() => {
      isRequestInProgress = false;
    }, 1000);
  };

  return (
    <div className="page">
      <h1>Welcome to DisEngage</h1>
      <button className="oauth-button" onClick={handleGoogleLogin}>
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
