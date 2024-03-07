// WebSocketContext.js
// WebSocketContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a WebSocket context
export const WebSocketContext = createContext(null);

// WebSocketProvider component to wrap your app with WebSocket context
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8010'); // Replace with your WebSocket server URL
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);
