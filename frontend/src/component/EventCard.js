import React, { useState } from 'react';
import { format } from 'date-fns';
import './EventCard.css'; // Ensure the CSS file is updated for the new button placement

function EventCard({ event }) {
    const [isExpanded, setIsExpanded] = useState(false); // State to track if the card is expanded

    // Function to toggle expansion when the card is clicked
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const date = new Date(event.startTime);
    const formattedDate = format(date, "MMMM do, yyyy, hh:mm a");

    // Function to strip HTML tags from the description
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    return (
        <>
            {/* The main event card container */}
            <div
                className="w-[333.13px] h-fit shadow-md hover:shadow-2xl border overflow-hidden bg-slate-100 rounded-lg cursor-pointer"
                onClick={handleToggleExpand}
            >
                <img
                    className="object-cover h-40 w-full"
                    src={event.image || "https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg"}
                    alt={`${event.name} image`}
                />
                <div className="w-full">
                    <p className="font-geist_regular text-lg leading-tight p-2 m-2 max-w-[331px] break-words">{event.name}</p>
                    <p className="font-geist_regular text-sm px-2 mx-2">{event.venue}</p>
                    <p className="font-geist_regular text-sm px-2 mx-2 pb-2 mb-2">{formattedDate}</p>
                </div>
            </div>

            {/* Expanded view rendered as an overlay */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white w-3/4 max-w-2xl rounded-lg shadow-lg p-8 relative">
                        {/* Event details in expanded view */}
                        <img
                            className="object-cover w-full h-64 rounded-lg mb-4"
                            src={event.image || "https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg"}
                            alt={`${event.name} image`}
                        />
                        <h2 className="text-2xl font-geist_regular mb-4">{event.name}</h2>
                        <p className="text-sm mb-4">{formattedDate}</p>
                        <p className="text-sm mb-4">{event.venue}</p>
                        <p className="text-base">{stripHtml(event.description)}</p>

                        {/* Close button at the bottom center */}
                        <div className="flex justify-center mt-6">
                            <button className ="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700">
                                Add to cart
                            </button>
                            <button
                                onClick={handleToggleExpand}
                                className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EventCard;
