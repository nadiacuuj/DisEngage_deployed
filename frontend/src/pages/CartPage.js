// Event Cart with Overlap Detection:
// This component displays selected events and checks for any schedule overlaps.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../apiFunctions/getUserInfo';
import getEvent from '../apiFunctions/getEvent';

const CartPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // State to hold selected events
  const [overlap, setOverlap] = useState(false); // State to track schedule overlaps

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get user info to access engage_events array
        const userData = await getUserInfo();
        
        // Fetch full event details for each event ID in engage_events
        const eventPromises = userData.engage_events.map(eventId => getEvent(eventId));
        const fetchedEvents = await Promise.all(eventPromises);
        
        setEvents(fetchedEvents);
        const hasOverlap = checkOverlap(fetchedEvents);
        setOverlap(hasOverlap);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Function to detect overlapping schedules
  const checkOverlap = (events) => {
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        if (
          new Date(event1.endTime) > new Date(event2.startTime) &&
          new Date(event1.startTime) < new Date(event2.endTime)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className="page">
      <h3>Your Cart</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h4>{event.name}</h4>
            <p>Venue: {event.venue}</p>
            <p>Time: {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
            <p>Categories: {event.category.join(', ')}</p>
          </li>
        ))}
      </ul>
      <p>{overlap ? "Schedule Overlap Detected!" : "No Schedule Conflicts"}</p>
      <button onClick={() => navigate('/schedule-review')}>Review Schedule</button>
    </div>
  );
};

export default CartPage;
