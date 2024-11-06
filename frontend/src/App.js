// Main Application Component ("App") with Routing:
// This file sets up routing for each page in the React app.

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // AI suggested: Use Routes instead of Switch (gave errors)
import './App.css';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import CategoryPage from './components/CategoryPage';
import CartPage from './components/CartPage';
import ScheduleReview from './components/ScheduleReview';
import Oauth from './components/Oauth';

// Setting up the routes to each page
function App() {
  return (
    // Router component to manage all routes and allows navigation between pages
    <Router>
      <div className="App">
        {/* Use Routes to wrap all Route components */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/schedule-review" element={<ScheduleReview />} />
          <Route path="/oauth" element={<Oauth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
