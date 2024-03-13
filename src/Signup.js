// SignUpForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';





const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');


  

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     // await axios.get('/payment')
      console.log("called payment")
      // Call the payment route to initiate Stripe payment
      const paymentResponse = await axios.get('/payment', {
        params: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
          phone: phone,
          gender: gender,
        }
      });

  
            window.location.href = paymentResponse.data.checkoutUrl;

/*
      if (paymentResponse.data.success) {
        // Payment successful, proceed with sign-up logic
        const signUpResponse = await axios.post('http://localhost:8090/api/signUp', {
          inputFirstName: firstName,
          inputLastName: lastName,
          inputUsername: username,
          inputEmail: email,
          inputPassword: password,
          phone: phone,
          inputGender: gender,
        });

        console.log(signUpResponse.data);
        // Handle successful sign-up
      } else {
        console.error('Payment failed:', paymentResponse.data.error);
        // Handle payment failure
      }*/
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error
    }
  };
  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="form-header">Sign Up</h2>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
        <div className="form-group">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
