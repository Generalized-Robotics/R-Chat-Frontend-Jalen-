import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';

import axios from 'axios';
import './landing-page.css'; // Import the CSS file

const LandingPage = () => {
    const navigate  = useNavigate(); // Get the history object

  const handleLoginAsGuest = async () => {
    try {
      await  axios.get('/guest')
      .then((response) => {
        console.log(".then never runs")
        const username = response.data.username; // Accessing the username from the response data
        // Navigate to the "/chat" route after successful login
        sessionStorage.setItem('username', username);

        console.log("username ", username);
        navigate('/login-as-guest');
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
      // Handle success, such as redirection or displaying a message
    /*  console.log('Successfully logged in as guest');
      setTimeout(() => {
      navigate('/login-as-guest');
    }, 3000); // Wait for 3 seconds (adjust the value as needed)*/


    } catch (error) {
      // Handle error, such as displaying an error message
      console.error('Error logging in as guest:', error);
    }
  };

  return (
    <div className="landing-page">
    <h1 style={{ color: '#9e7ed4' }}>Welcome to R-Chat!</h1>
      <div className="buttons">
        <Link to="/login" className="button">Login</Link>
        <Link to="/signup" className="button">Signup</Link>
        <button onClick={handleLoginAsGuest} className="button">Login as Guest</button>
      </div>
    </div>
  );
};

export default LandingPage;
