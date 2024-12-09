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

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar')}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;

    // Reset the flag after a delay to allow navigation
    setTimeout(() => {
      isRequestInProgress = false;
    }, 1000);
  };

  return (
    <div className="justify-items-center">
      <div className="flex flex-wrap w-1/2 p-5 m-5 items-center">
        <img src="/squished-logo.png" className='w-1/2'></img>
        <p className="w-1/2 text-xl font-semi-bold">Dis-engage in tedious event registration and scheduling</p>
      </div>

      <div className="flex flex-wrap -m-7">
        <div className="justify-items-center p-5 m-5">
          <img src ="/google-logo.png" className= "w-48 h-48 p-5 m-7"></img>
          <p className="max-w-1/2">1. log in using your gmail</p>
        </div>
        <div className="justify-items-center p-5 m-5">
          <img src= "/gcal.png" className="w-48 h-48 p-5 m-7"></img>
          <p className="max-w-48">2. we will sync your google calendar automatically</p>
        </div>
        <div className="justify-items-center p-5 m-5">
          <img src="/cart-icon.png" className="w-48 h-48 p-5 m-7"></img>
          <p className="max-w-48">3. enjoy shopping events without a hassle!</p>
        </div>
      </div>
      
      <button className="oauth-button" onClick={handleGoogleLogin}>
        Log in with Google
      </button> {/* This button now simulates OAuth login */}
    </div>
  );
};

export default Login;
