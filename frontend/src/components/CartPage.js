// Event Cart with Overlap Detection:
// This component displays selected events and checks for any schedule overlaps.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [events, setEvents] = useState([]); // State to hold selected events
  const [overlap, setOverlap] = useState(false); // State to track schedule overlaps

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events`); // Fetch events from backend
        setEvents(response.data); // Store events in state

        const hasOverlap = checkOverlap(response.data); // Check for overlaps
        setOverlap(hasOverlap); // Update overlap state based on result
      } catch (error) {
        console.error("Error fetching events:", error); // Log errors to console
      }
    };

    fetchEvents(); // Fetch events when component loads
  }, []);

  // Function to detect overlapping schedules
  const checkOverlap = (events) => {
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (
          events[i].end_time > events[j].start_time &&
          events[i].start_time < events[j].end_time
        ) {
          return true; // Return true if overlap is detected
        }
      }
    }
    return false; // Return false if no overlap
  };

  return (
    <div className="page">
      <h3>Your Cart</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{`${event.name} - ${event.start_time} to ${event.end_time}`}</li>
        ))} {/* Render each event */}
      </ul>
      <p>{overlap ? "Overlap detected!" : "No overlap detected"}</p> {/* Display overlap status */}
      <button>Review Schedule</button> {/* Button to proceed to schedule review */}
    </div>
  );
};

export default CartPage;
