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
   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

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
         
         // Log the entire response for debugging
         console.log('Full API response:', response);
         
         if (!response.ok) {
           throw new Error(`Error fetching calendar events: ${response.statusText}`);
         }
         
         const data = await response.json();
         
         // Log the parsed data
         console.log('Parsed data:', data);
         console.log('Events:', data.events);
         
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

   // Group events by day with more robust logging
  const getEventsForDay = (date) => {
  console.log('Current events:', events);
  console.log('Checking events for date:', format(date, 'yyyy-MM-dd'));
  
  console.log("LOOK HERE  ", getEngageArray());  

//  {'start': '2024-12-04T14:00:00-05:00', 'end': '2024-12-04T15:15:00-05:00', 'summary': 'Negotiation'}]

    return events.filter(event => {
      try {
        const eventDate = new Date(event.start);
        const eventDateString = format(eventDate, 'yyyy-MM-dd');
        const targetDateString = format(date, 'yyyy-MM-dd');
  
        console.log(`Comparing: Event date (${eventDateString}) vs Target date (${targetDateString})`);
  
        return eventDateString === targetDateString;
      } catch (error) {
        console.error('Error parsing event date:', event.start, error);
        return false;
      }
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
                  <div key={index} className="event-card">
                    <p className="event-time">
                      {format(new Date(event.start), 'h:mm a')}
                    </p>
                    <p className="event-end">
                      {format(new Date(event.end), 'h:mm a')}
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

