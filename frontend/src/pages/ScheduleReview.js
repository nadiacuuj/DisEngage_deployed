// Schedule Review Page:
// This component displays a schedule review page, with options to go back or proceed to RSVP.

// Note:
// This is a simple placeholder for OAuth login, with a button to simulate an OAuth login for NYU. 
// Replace it with real OAuth code when ready.

import React from 'react';

const ScheduleReview = () => {
  return (
    <div className="page">
      <h3>Schedule Review</h3> {/* Main heading for the page */}
      <p>Review your schedule here. Adjust any conflicts if necessary.</p> {/* Instruction text */}
      <button>Go Back</button> {/* Button to go back */}
      <button>Proceed to RSVP</button> {/* Button to proceed with RSVP */}
    </div>
  );
};

export default ScheduleReview;
