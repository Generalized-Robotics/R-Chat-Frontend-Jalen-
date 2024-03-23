import React, { useState } from 'react';
import axios from 'axios';
import './setting.css'
import { reset, getUid } from './auth';
import { useNavigate  } from 'react-router-dom';


const Settings = () => {
    const [orientation, setOrientation] = useState('');
    const [email, setEmail] = useState('');
    const [subscriptionId, setSubscriptionId] = useState('');
    const navigate  = useNavigate(); // Get the history object



    const handleSaveOrientation = async () => {
        try {
            const response = await axios.get(`https://10.78.140.215:443/setOrientation?orientation=${orientation}&username=${sessionStorage.getItem('username')}`);
            console.log(response.data);
            // Add any additional logic for handling the response
        } catch (error) {
            console.error('Error saving orientation:', error);
        }
    };

    const handleResetPassword = async () => {
        try {
          ///  const response = await axios.get(`/resetPassword?email=${email}&username=${sessionStorage.getItem('username')}`);
           // console.log(response.data);
           reset(email)
            // Add any additional logic for handling the response
           alert("reset email sent to " + email)
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };



    const handleGetSubscriptionId = async () => {
        try {
            const response = await axios.get(`https://10.78.140.215:443/api/getSubscriptionId?username=${sessionStorage.getItem("username")}`);
            setSubscriptionId(response.data.subscriptionId);
        } catch (error) {
            console.error('Error fetching subscription ID:', error);
        }
    };

    const handleCancelSubscription = async () => {
      
        try {
            const confirmCancel = window.confirm("Are you sure you want to cancel your subscription? You will never get this account back.");
            if (confirmCancel) {
                navigate('/');
                console.log("firebase uid ", getUid());
                const fireId = getUid();
               await handleGetSubscriptionId();
                console.log("firebase uid ", fireId);
                await axios.get(`https://10.78.140.215:443/disable?uid=${fireId}`);
               
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
        }
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <div className="orientation-section">
                <label htmlFor="orientation">Sexual Preference</label>
                <select id="orientation" value={orientation} onChange={(e) => setOrientation(e.target.value)} required>
                    <option value="">Select Orientation</option>
                    <option value="gay">Gay</option>
                    <option value="straight">Straight</option>
                    <option value="bisexual">Bisexual</option>
                </select>
                <button onClick={handleSaveOrientation}>Save</button>
            </div>
            <div className="reset-password-section">
                <label htmlFor="resetPassword">Reset Password</label>
                <input type="text" id="resetPassword" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button onClick={handleResetPassword}>Reset</button>
            </div>
            <div className="cancel-subscription-section">
                <button onClick={handleCancelSubscription} className="cancel-subscription-button">Cancel Subscription</button>
            </div>
        </div>
    );
}

export default Settings;
