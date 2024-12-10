// Main Landing Page Component:
// This component is the main page after logging in, with buttons to navigate to other parts of the app.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6
import { useState } from 'react';

const TestPage = () => {
  const navigate = useNavigate(); // useNavigate is a React hook to handle navigation (when each button is clicked)
  const userId = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  async function getUserInfo(){
    const response = await fetch("https://disengage-backend-270035954698.us-central1.run.app/api/getUserInfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${userId}`
        }
    })
    const data = await response.json()
    console.log("FETCH", data) //testing
    return data
  }


  async function delteUserInfo(){
    const response = await fetch("https://disengage-backend-270035954698.us-central1.run.app/api/clearEngageEvents", {
        method: "POST",
        body: JSON.stringify(userId)
    })
  }
  
  async function updateUser(){
    let userInfo = getUserInfo();

    const test_ids = ["123456","23456","99933"]
    const updateUserBody = 
    {
      token: userId,
      google_id: userInfo['google_id'],
      event_ids:test_ids,
    };

    const response = await fetch("https://disengage-backend-270035954698.us-central1.run.app/api/updateEngageEvents", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(updateUserBody),
    });
    return response   
  }

  async function handleUserInfo(){
    const response = await getUserInfo();
    
    setUserData(response);

    console.log("VARIABLE", userData) // testing
  }

  async function fetchGoogleCalendarEvents() {
    try {
      const response = await fetch("https://disengage-backend-270035954698.us-central1.run.app/api/getGoogleCalendar", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching calendar events: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Calendar Events:", data.events); // Testing
      setCalendarEvents(data.events); // Store events in state
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    }
  }

  async function fetchOneEvent(){
    try{
      const response = await fetch("https://disengage-backend-270035954698.us-central1.run.app/api/oneEvent",{
        method: "GET",
        headers: {
          EventId: "673f8724c883bd119684bbb0"
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching calendar events: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("EEEEVENT DATA", data)
    }
    catch (error) {
      console.error("Failed to fetch calendar events:", error);
    }
  }

  return (
    <div className="page">
      <h2>Welcome to Evently</h2> {/* Welcome message */}
      <button onClick={() => handleUserInfo()}>Navigate to NYU Engage</button> {/* Button to navigate to OAuth page */}

      {userData ? (
        <p>
          User Name: {userData.name} <br />
          Email: {userData.email} <br />
          Google ID: {userData.google_id} <br />
          ENGAGE EVENTS: {userData.engage_events[1]} {userData.engage_events[2]}
        </p>
      ) : (
        <p>No user data available. Please fetch user info.</p>
      )}

      <button onClick={() => updateUser()}>Get User info</button>
      <button onClick={fetchOneEvent}>Fetch Google Calendar Events</button> {/* Button to fetch Google Calendar events */}

      {calendarEvents.length > 0 ? (
        <div>
          <h3>Google Calendar Events:</h3>
          <ul>
            {calendarEvents.map((event, index) => (
              <li key={index}>
                <strong>Summary:</strong> {event.summary} <br />
                <strong>Start:</strong> {event.start}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No calendar events available. Please fetch events.</p>
      )}
    </div>
  );
};

export default TestPage;
