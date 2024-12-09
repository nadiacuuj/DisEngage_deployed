// // Schedule Review Page:
// // This component displays a schedule review page, with options to go back or proceed to RSVP.


import React, { useEffect, useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import Navigationbar from '../component/NavigationBar';
import './ScheduleReview.css';
import getEvent from '../apiFunctions/getEvent';
import getUserInfo from '../apiFunctions/getUserInfo';
import getEngageArray from '../apiFunctions/getAllEvents';

const ScheduleReview = () => {
   const [googleEvents, setGoogleEvents] = useState([]);
   const [engageEvents, setEngageEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

   useEffect(() => {
     const fetchAllEvents = async () => {
       try {
         const userId = localStorage.getItem("token");
         
         // First fetch engage events to get their dates
         const userData = await getUserInfo();
         const eventPromises = userData.engage_events.map(eventId => getEvent(eventId));
         const fetchedEngageEvents = await Promise.all(eventPromises);
         setEngageEvents(fetchedEngageEvents);

         // Fetch all Google Calendar events for display
         const calendarResponse = await fetch("http://127.0.0.1:8000/api/getGoogleCalendar", {
           method: "GET",
           headers: {
             Authorization: `Bearer ${userId}`,
           },
         });
         
         if (!calendarResponse.ok) {
           throw new Error(`Error fetching calendar events: ${calendarResponse.statusText}`);
         }
         
         const calendarData = await calendarResponse.json();
         const filteredCalendarEvents = (calendarData.events || []).filter(event => {
           const isAllDay = !event.start.includes('T');
           const isOfficeOrHome = event.summary === 'Office' || event.summary === 'Home';
           return !(isAllDay && isOfficeOrHome);
         });
         setGoogleEvents(filteredCalendarEvents);

         // Get engage event dates for filtering
         const engageDates = fetchedEngageEvents.map(event => 
           format(new Date(event.startTime), 'yyyy-MM-dd')
         );
         
         // Filter Google events to only include dates that match engage events
         const filteredGoogleEvents = filteredCalendarEvents.filter(event => {
           const eventDate = format(new Date(event.start), 'yyyy-MM-dd');
           return engageDates.includes(eventDate);
         });

         // Store filtered events in the database
         const storeResponse = await fetch("http://127.0.0.1:8000/api/storeFilteredGoogleEvents", {
           method: "POST",
           headers: {
             "Authorization": `Bearer ${userId}`,
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
             filteredEvents: filteredGoogleEvents
           })
         });
         
         if (!storeResponse.ok) {
           throw new Error(`Error storing filtered events: ${storeResponse.statusText}`);
         }

       } catch (error) {
         setError(error.message);
         console.error("Failed to fetch events:", error);
       } finally {
         setLoading(false);
       }
     };
     
     fetchAllEvents();
   }, []);

   // Add navigation functions
   const goToPreviousWeek = () => {
     setCurrentWeekStart(prevDate => addDays(prevDate, -7));
   };

   const goToNextWeek = () => {
     setCurrentWeekStart(prevDate => addDays(prevDate, 7));
   };

   const goToCurrentWeek = () => {
     setCurrentWeekStart(startOfWeek(new Date()));
   };

   // Update getDaysOfWeek to use currentWeekStart
   const getDaysOfWeek = () => {
     return [...Array(7)].map((_, index) => addDays(currentWeekStart, index));
   };

   // Updated getEventsForDay to handle both types of events and sort them by start time
   const getEventsForDay = (date) => {
     const formattedDate = format(date, 'yyyy-MM-dd');
     
     const googleEventsForDay = googleEvents.filter(event => {
       try {
         const eventDate = new Date(event.start);
         return format(eventDate, 'yyyy-MM-dd') === formattedDate;
       } catch (error) {
         console.error('Error parsing Google event date:', event.start, error);
         return false;
       }
     }).map(event => ({
       ...event,
       type: 'google'
     }));

     const engageEventsForDay = engageEvents.filter(event => {
       try {
         const eventDate = new Date(event.startTime);
         return format(eventDate, 'yyyy-MM-dd') === formattedDate;
       } catch (error) {
         console.error('Error parsing Engage event date:', event.startTime, error);
         return false;
       }
     }).map(event => ({
       start: event.startTime,
       end: event.endTime,
       summary: event.name,
       type: 'engage',
       venue: event.venue,
       category: event.category
     }));

     return [...googleEventsForDay, ...engageEventsForDay].sort((a, b) => {
       const dateA = new Date(a.start);
       const dateB = new Date(b.start);
       return dateA - dateB;
     });
   };

   const handleAddToGoogleCalendar = async () => {
     try {
       const userId = localStorage.getItem("token");
       const userData = await getUserInfo();
       
       // Add each engage event to Google Calendar
       const addPromises = userData.engage_events.map(eventId => 
         fetch("http://127.0.0.1:8000/api/addToGoogleCalendar", {
           method: "POST",
           headers: {
             "Authorization": `Bearer ${userId}`,
             "Content-Type": "application/json",
           },
           body: JSON.stringify({ event_id: eventId })
         }).then(res => {
           if (!res.ok) throw new Error(`Failed to add event ${eventId}`);
           return res.json();
         })
       );

       await Promise.all(addPromises);
       alert("Successfully added all events to Google Calendar!");
     } catch (error) {
       console.error("Error adding events to Google Calendar:", error);
       alert("Failed to add some events to Google Calendar");
     }
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
         
         {/* Add navigation controls */}
         <div className="calendar-controls">
           <button onClick={goToPreviousWeek}>&lt; Previous Week</button>
           <button onClick={goToCurrentWeek}>Current Week</button>
           <button onClick={goToNextWeek}>Next Week &gt;</button>
         </div>
         
         {/* Display current week range */}
         <div className="week-range">
           {format(currentWeekStart, 'MMM d, yyyy')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
         </div>

         <div className="weekly-calendar">
           {getDaysOfWeek().map((date) => (
             <div key={date.toString()} className="day-column">
               <h4>{format(date, 'EEEE')}</h4>
               <p>{format(date, 'MMM d')}</p>
               <div className="events-list">
                 {getEventsForDay(date).map((event, index) => (
                   <div 
                     key={index} 
                     className={`event-card ${event.type === 'engage' ? 'engage-event' : ''}`}
                   >
                     <p className="event-time">
                       {format(new Date(event.start), 'h:mm a')}
                     </p>
                     <p className="event-end">
                       {format(new Date(event.end), 'h:mm a')}
                     </p>
                     <p className="event-title">{event.summary}</p>
                     {event.type === 'engage' && (
                       <>
                         <p className="event-venue">Venue: {event.venue}</p>
                         <p className="event-category">Categories: {event.category.join(', ')}</p>
                       </>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
         <button onClick={handleAddToGoogleCalendar}>Add All Events to Google Calendar</button>
       </div>
     </div>
   );
};

export default ScheduleReview;



// import React, { useEffect, useState } from 'react';
// import { format, startOfWeek, addDays } from 'date-fns';
// import Navigationbar from '../component/NavigationBar';
// import './ScheduleReview.css';

// const ScheduleReview = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCalendarEvents = async () => {
//       try {
//         const userId = localStorage.getItem("token");
//         const response = await fetch("http://127.0.0.1:8000/api/getGoogleCalendar", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${userId}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error fetching calendar events: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setEvents(data.events || []);
//       } catch (error) {
//         setError(error.message);
//         console.error("Failed to fetch calendar events:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCalendarEvents();
//   }, []);

//   // Generate array of 7 days starting from current week
//   const getDaysOfWeek = () => {
//     const startDate = startOfWeek(new Date());
//     return [...Array(7)].map((_, index) => addDays(startDate, index));
//   };

//   // Group events by day
//   const getEventsForDay = (date) => {
//     return events.filter(event => {
//       const eventDate = new Date(event.start);
//       return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
//     });
//   };

//   if (loading) {
//     return <div className="page">Loading calendar...</div>;
//   }

//   if (error) {
//     return <div className="page">Error loading calendar: {error}</div>;
//   }

//   return (
//     <div>
//       <Navigationbar />
//       <div className="page">
//         <h3>Weekly Schedule Review</h3>
//         <div className="weekly-calendar">
//           {getDaysOfWeek().map((date) => (
//             <div key={date.toString()} className="day-column">
//               <h4>{format(date, 'EEEE')}</h4>
//               <p>{format(date, 'MMM d')}</p>
//               <div className="events-list">
//                 {getEventsForDay(date).map((event, index) => (
//                   <div key={index} className="event-card">
//                     <p className="event-time">
//                       {format(new Date(event.start), 'h:mm a')}
//                     </p>
//                     <p className="event-title">{event.summary}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleReview;

