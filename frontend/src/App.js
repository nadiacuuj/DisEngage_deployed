// Main App Component with Routes
// Sets up routes for the application to load different pages

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Explanation from AI on error received: Use Routes and Route instead of Switch and useHistory in React Router v6
import './App.css';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import CartPage from './pages/CartPage';
import ScheduleReview from './pages/ScheduleReview';
import Oauth from './pages/OAuth2Callback';
import CategoryPage from './pages/CategoryPage';
import OrganizationListPage from './pages/OrganizationList';
import OAuth2Callback from './pages/OAuth2Callback';
import TestPage from './pages/Test';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Use Routes to wrap all Route components */}
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route loads the Login component */}
          <Route path="/landing" element={<LandingPage />} /> {/* Route to the main landing page */}
          <Route path="/categories" element={<CategoryPage />} /> {/* Route to category search page */}
          <Route path="/OrganizationList" element={< OrganizationListPage/>} />
          <Route path="/cart" element={<CartPage />} /> {/* Route to cart page */}
          <Route path="/schedule-review" element={<ScheduleReview />} /> {/* Route to schedule review page */}
          <Route path="/callback" element={<OAuth2Callback />} /> {/* Route to OAuth page */}
          <Route path='/test' element={<TestPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
