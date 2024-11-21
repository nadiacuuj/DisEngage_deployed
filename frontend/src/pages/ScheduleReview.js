// Schedule Review Page:
// This component displays a schedule review page, with options to go back or proceed to RSVP.

// Note:
// This is a simple placeholder for OAuth login, with a button to simulate an OAuth login for NYU. 
// Replace it with real OAuth code when ready.

import React, { useEffect, useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import Navigationbar from '../component/NavigationBar';
import './ScheduleReview.css';

const ScheduleReview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const userId = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/getGoogleCalendar", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userId}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching calendar events: ${response.statusText}`);
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  // Generate array of 7 days starting from current week
  const getDaysOfWeek = () => {
    const startDate = startOfWeek(new Date());
    return [...Array(7)].map((_, index) => addDays(startDate, index));
  };

  // Group events by day
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  if (loading) {
    return <div className="page">Loading calendar...</div>;
  }

  if (error) {
    return <div className="page">Error loading calendar: {error}</div>;
  }

  return (
    <div>
      <Navigationbar />
      <div className="page">
        <h3>Weekly Schedule Review</h3>
        <div className="weekly-calendar">
          {getDaysOfWeek().map((date) => (
            <div key={date.toString()} className="day-column">
              <h4>{format(date, 'EEEE')}</h4>
              <p>{format(date, 'MMM d')}</p>
              <div className="events-list">
                {getEventsForDay(date).map((event, index) => (
                  <div key={index} className="event-card">
                    <p className="event-time">
                      {format(new Date(event.start), 'h:mm a')}
                    </p>
                    <p className="event-title">{event.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleReview;
