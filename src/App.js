// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import LoginAsGuest from './startChat';
import StartChat from './startChat';
import ChatBox from './ChatBox';
import Settings from './Settings'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login-as-guest" element={<LoginAsGuest />} />
        
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/settings" element={<Settings />} />
        {/* Add route for StartChat if needed */}
      </Routes>
    </Router>
  );
};

export default App;

