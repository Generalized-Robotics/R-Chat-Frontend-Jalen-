// LoginForm.js
// LoginForm.js
import React, { useState } from 'react';
import { login } from './auth';
import './Login.css';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';




const LoginForm = () => {
    const  navigate = useNavigate(); // Get the history object

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password)
          .then((user) => {
            if (user) {
                navigate('/login-as-guest');
                
              // Fetch the username from the server after successful login
              axios.get('http://localhost:8090/getUserName', {
                params: { inputEmail: email }
              })
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
            } else {
              // Handle unsuccessful login
              // setError('Login failed. Please check your credentials.');
            }
          })
          .catch((error) => {
            // Handle login error
            // setError(error);
            console.error("Error logging in:", error);
          });
      };
    return (
      <div className="container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h2 className="form-header">Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  };
  

export default LoginForm;
