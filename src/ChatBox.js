// ChatBox.js
import './chat.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';


const ChatBox = () => {

    const  navigate = useNavigate(); // Get the history object

    
    const [username, setUsername] = useState('');
    const [mediaStream, setMediaStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const socketRef = useRef(null);
    const remoteVideoRef = useRef();
    const [redirect, setRedirect] = useState(false); // State to control redirection


   


    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [socket, setSocket] = useState(null); // State for the WebSocket connection
    const videoRef = useRef();
  
    useEffect(() => {
        // Establish WebSocket connection
        socketRef.current = new WebSocket('ws://localhost:8010');
        socketRef.current.onopen = () => {
          console.log('WebSocket connection established');
          
          // Send a message to the server to notify that the user has connected
          const currentUser = sessionStorage.getItem('username');
          socketRef.current.send(JSON.stringify({ action: 'userConnected', username: currentUser }));
      
          // Set the socket state to trigger other useEffect hooks
          setSocket(socketRef.current);
        };
        socketRef.current.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            console.log("event data ", eventData.type);
            if (eventData.type === 'okDONE') {
                console.log("user not in session")
                setRedirect(true)
           console.log("user not in session")
            }else{
                console.log("user in sesh")
            }
          };
      
        socketRef.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
      
      
        return () => {
          // Clean up WebSocket connection when component unmounts
          if (socketRef.current) {
            socketRef.current.close();
            console.log('WebSocket connection closed');
          }
        };
      }, []); // Run only once on component mount
          // Listen for 'matchFound' event
          var end = false;

    
      
          useEffect(() => {
            // Redirect to chatbox page if 'redirect' state is true
            if (redirect) {
              console.log("redirecting")
             navigate('/login-as-guest'); // Redirect to the chat route
              // Change '/chatbox' to your chatbox page URL
            }
          }, [redirect, navigate]);

        
    useEffect(() => {
        const handleGetMessages = async () => {
          
          try {
            if (socket) {
              const currentUser = sessionStorage.getItem('username');
              socket.send(JSON.stringify({ action: 'getMessages', username: currentUser }));
             
              // Listen for incoming messages from the WebSocket server
              if (socket) { // Add a null check before setting up the event listener
                socket.onmessage = (event) => {
                  const data = JSON.parse(event.data);
                 console.log("data " , data)
                
                    // Update chat messages state with the received messages, handle null or undefined messages
                    if (data.data && data.data.messages) { // Check if data.data.messages exists
                        // Update chat messages state with the received messages
                    
                    setChat(data.data.messages || []);
                  
                    setTimeout(handleGetMessages, 500); // Adjust the interval as needed

                    setChat(data.data.messages);
                    } else {
                       
                        console.error('Received data does not contain messages:', data);
                    }
                };
              }
            } else {
              console.error('WebSocket connection is null');
            }
          } catch (error) {
            console.error('Error getting chat:', error);
          }
        };
      
        // Call handleGetMessages when the component mounts and username changes
       handleGetMessages();
      
      
        // Clean up the WebSocket event listener when the component unmounts
        return () => {
          if (socket) {
            socket.onmessage = null;
          }
        };
      }, [socket, username]); // Run this effect whenever socket or username changes
      

  
      
  useEffect(() => {
 

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setMediaStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [username]);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
        console.log("displaying current user stream")
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream && socket) {
        // Send the webcam stream to the server
        console.log("media " , mediaStream)
        const videoTrack = mediaStream.getVideoTracks()[0];
        if (videoTrack) {
            socket.send(JSON.stringify({ action: 'sendVideoStream', stream: videoTrack }));
        } else {
            console.error('No video track found in the media stream');
        }
    
        
    }
}, [mediaStream, socket]);


// Inside the useEffect for WebSocket message handling
// Handle incoming video stream from server
useEffect(() => {
    const handleIncomingVideoStream = (event) => {
        const data = JSON.parse(event.data);
        console.log("attaempting displaying matched user stream " + data.stream)

        if (data.action === 'forwardVideoStream' && data.stream) {
            console.log("attaempting displaying matched user stream 34" + data.stream)

            // Check if the received data contains a video stream
            const remoteStream = new MediaStream([data.stream]);
            setRemoteStream(remoteStream);
        }
    };

    if (socket) {
        socketRef.current.addEventListener('message', handleIncomingVideoStream);
    }

    return () => {
        if (socket) {
            socketRef.current.removeEventListener('message', handleIncomingVideoStream);
        }
    };
}, [socket]);





// Attach remote stream to the video element
useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
        console.log("displaying matched user stream")

      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  

// Attach remote stream to the video element
useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      // Create a new MediaStream object using the received stream data
      const remoteMediaStream = new MediaStream();
      const remoteVideoTrack = new MediaStreamTrack();
      remoteVideoTrack.kind = 'video';
      remoteVideoTrack.id = 'remote-video-track';
      remoteVideoTrack.enabled = true;
      remoteMediaStream.addTrack(remoteVideoTrack);
      remoteVideoTrack.onended = () => console.log('Remote stream ended');
      remoteVideoTrack.onmute = () => console.log('Remote stream muted');
      remoteVideoTrack.onunmute = () => console.log('Remote stream unmuted');
      remoteVideoTrack.onoverconstrained = () => console.log('Remote stream overconstrained');
      remoteVideoTrack.onended = () => console.log('Remote stream ended');
  
      remoteVideoRef.current.srcObject = remoteMediaStream;
      remoteMediaStream.addTrack(remoteStream.getVideoTracks()[0]);
    }
  }, [remoteStream]);
  
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }
  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        if (socket) {
            
          const currentUser = sessionStorage.getItem('username');
          socket.send(JSON.stringify({ action: 'sendMessage', username: currentUser, message: message }));
          setMessage('');
        } else {
          console.error('WebSocket connection is null');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }
  const handleEndChat = async () => {
    
      try {
        if (socket) {
            
          const currentUser = sessionStorage.getItem('username');
          socket.send(JSON.stringify({ action: 'endChat', username: currentUser }));
         navigate('/login-as-guest');

        } else {
          console.error('WebSocket connection is null');
        }
      } catch (error) {
        console.error('Error leaving:', error);
      }
    
  }

  const checkSession =async  () => {
    
    try {
      if (socket) {
          
        const currentUser = sessionStorage.getItem('username');
        socketRef.current.send(JSON.stringify({ action: 'inSession?', username: currentUser }));
     //  navigate('/login-as-guest');

      } else {
        console.error('WebSocket connection is null');
      }
    } catch (error) {
      console.error('Error leaving:', error);
    }
   
}


  return (
    <div className="app-container">
      <div className="video-container">
        <div className="video-left">
          <div className="video-self">
            <video ref={videoRef} autoPlay={true} />
          </div>
          <div className="video-remote">
            {/* Display the remote user's video feed */}
            {remoteStream && <video ref={remoteVideoRef} autoPlay={true} />}

         
          </div>
        </div>
        <div className="chat-container">
        <div className="chat-box">
    Chat Messages: 
    {chat.map((message, index) => (
      <div key={index}>
        <span>{message.sender}: </span>
        <span>{message.message}</span>
      </div>
    ))}
  </div>
          <div className="input-box">
          <input type="text" placeholder="Type your message..." value={message} onChange={handleMessageChange} />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <button className="end-chat-btn" onClick={handleEndChat}>End Chat</button>

        </div>
      </div>
    </div>
  );
}

export default ChatBox;