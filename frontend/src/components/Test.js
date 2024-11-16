// Main Landing Page Component:
// This component is the main page after logging in, with buttons to navigate to other parts of the app.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6

const LandingPage = () => {
  const navigate = useNavigate(); // useNavigate is a React hook to handle navigation (when each button is clicked)
  const token = localStorage.getItem("token");

  async function getUserInfo(){
    const response = await fetch("http://127.0.0.1:8000/api/getUserInfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.json()
  }

  async function delteUserInfo(){
    const response = await fetch("http://127.0.0.1:8000/api/clearEngageEvents", {
        method: "POST",
        body: JSON.stringify(token)
    })
  }

  async function updateUser(){
    userInfo = getUserInfo();

    const response = await fetch("http://127.0.0.1:8000/api/updateEngageEvents", {
        method: 'POST',
        body: {'token': JSON.stringify(token), "google_id": userInfo['google_id']}
    })

    return response
  }

  return (
    <div className="page">
      <h2>Welcome to Evently</h2> {/* Welcome message */}
      <button onClick={() => navigate('/oauth')}>Navigate to NYU Engage</button> {/* Button to navigate to OAuth page */}
      <button onClick={() => navigate('/categories')}>Search by Category</button> {/* Button to navigate to category page */}

      <button>Get User info</button>
    </div>
  );
};

export default LandingPage;
