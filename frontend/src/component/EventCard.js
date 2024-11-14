import React, { useState } from 'react';
import './EventCard.css'; // Import the external CSS file

function EventCard({ event }) {
    const [isExpanded, setIsExpanded] = useState(false); // State to track if the card is expanded

    // Function to toggle expansion when the card is clicked
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div 
            // The main container for the event card
            // `hover:shadow-2xl` applies the hover effect, making the shadow larger when hovered
            // `onClick={handleToggleExpand}` allows the card to expand to fullscreen when clicked
            className={`w-fit h-fit shadow-md hover:shadow-2xl border overflow-hidden bg-slate-100 rounded-lg ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggleExpand}
        >
            <img className="object-cover h-40 w-full" src={event.ImageSrc} alt="Event image" />
            <div className='w-full'>
                <p className="text-lg leading-tight p-2 m-2 max-w-[331px] break-words">{event.EventTitle}</p>
                <p className="text-sm px-2 mx-2">{event.EventLocation}</p>
                <p className="text-sm px-2 mx-2 pb-2 mb-2">{event.EventTime}</p>
            </div>
            
            {/* This section is conditionally rendered only if the card is expanded */}
            {isExpanded && (
                <div className="expanded-content">
                    {/* Additional content displayed when expanded */}
                    <p className="text-base p-4">{event.EventDescription}</p>
                    
                    {/* Close button to collapse the expanded view when clicked */}
                    <button onClick={handleToggleExpand} className="close-button">Close</button>
                </div>
            )}
        </div>
    );
}

export default EventCard;