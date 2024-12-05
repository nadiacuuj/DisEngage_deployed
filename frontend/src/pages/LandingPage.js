// Main Landing Page Component:
// This component is the main page after logging in, with buttons to navigate to other parts of the app.

import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6

const LandingPage = () => {
  const navigate = useNavigate(); // useNavigate is a React hook to handle navigation (when each button is clicked)

  return (
    <div className="justify-items-center">
      <img className="w-1/4 m-6" src="/squished-logo.png"alt="Disengage logo"></img>
      <div className="flex flex-wrap justify-center gap-16">
        <div className="flex flex-col items-center text-center">
          <img src ="/nyu-engage.jpeg" className="w-96 h-32 rounded-full mb-4 border-zinc-950 border-2"></img>
          <p className="text-lg font-medium mb-4">Looking for official management business?</p>
          <button
            onClick={() => window.open("https://engage.nyu.edu/",'_blank')}
            className="bg-purple-600 text-white py-2 px-6 w-full rounded-lg hover:bg-purple-700"
          >
            Go to NYU Engage
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <img src ="/categorysearch.png" className=" w-96 h-32 rounded-full mb-4 border-zinc-950 border-2"></img>
          <p className="text-lg font-medium mb-4">Looking to browse events and organization?</p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-purple-600 text-white py-2 px-6 w-full rounded-lg hover:bg-purple-700"
          >
            Browse Categories
          </button>
        </div>
</div>

    </div>
  );
};

export default LandingPage;
