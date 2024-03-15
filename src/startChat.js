import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from './auth'; // Import the logout function from auth.js
import './startChatPage.css'; // Import CSS file for styling
import Peer from 'peerjs';





const StartChatPage = () => {

  const [socket, setSocket] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [redirect, setRedirect] = useState(false); // State to control redirection
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to control loading indicator

  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);


  useEffect(() => {
  
    // Establish WebSocket connection
   // const newSocket = new WebSocket('ws://129b-2601-c9-4000-a2e0-288a-6810-31aa-6adb.ngrok-free.app:8010');
    const newSocket = new WebSocket('wss://10.0.0.239:443');
    //const newSocket = new WebSocket('wss://' + window.location.host);
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(newSocket);
    };
    newSocket.onerror = (error) => {
      console.error('WebSocket connection error:', error);
    };

    // Listen for 'matchFound' event
    newSocket.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      console.log("event data ", eventData.type);
      if (eventData.type === 'okDONE') {
        console.log('Match found:', eventData.data.partnerId);
      
        setRedirect(true); // Set redirect state to true
      }
    };

    // Clean up function
    return () => {
      if (newSocket) {
        newSocket.close();
        console.log('WebSocket connection closed');
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Make HTTP request to set guest gender and orientation
      console.log("calling route")
      // axios.get('http://localhost:8090/guest');
      console.log("im done calling route")

    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  useEffect(() => {
    // Redirect to chatbox page if 'redirect' state is true
    if (redirect) {
      console.log("redirecting")
      navigate('/chat'); // Redirect to the chat route
      // Change '/chatbox' to your chatbox page URL
    }
  }, [redirect, navigate]);

  const handleStartChat = async () => {
    
    try {
      if (!chatStarted) {
        setIsLoading(true); // Show loading indicator

        // Call initializeChat function only if chat has not started yet
        console.log("initializing it")
        // await  initializeChat();
        console.log("initializing it1")
        setChatStarted(true);
        console.log("initializing it3")

      }
      setTimeout(() => {
        if (socket) {
          console.log("starting the chat man")
          const currentUser = sessionStorage.getItem('username');
          console.log("current user " + currentUser)

          socket.send(JSON.stringify({ action: 'startChat', username: currentUser }));
         
        } else {
          console.log("not starting the chat man")
          console.error('WebSocket connection is null');
        }
      }, 1000); // Wait for 3 seconds (adjust the value as needed)
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };


  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Redirect to the home route after logout
  };
  
  const handleSettings = () => {
    
    navigate('/settings'); // Redirect to the home route after logout
  };
  return (
    <div className="start-chat-page">


        
      <h1>Start Chatting</h1>
      <button onClick={handleStartChat} disabled={!socket || chatStarted} className="start-chat-button">
        Start Chatting
      </button>
      <button onClick={handleSettings} className="settings">
        Settings
      </button>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      {isLoading && (
        <div className="loading-container">
          <div className="loading"></div>
          <p>Finding Chat...</p>
        </div>
      )}
    </div>
  );
};

export default StartChatPage;