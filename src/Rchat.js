
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

import Peer from 'peerjs';
import './chat.css';
var chatId;



const Rchat = () => {

    const  navigate = useNavigate(); // Get the history object
  


    
    const [username, setUsername] = useState('');
    const [mediaStream, setMediaStream] = useState(null);
   // const [remoteStream, setRemoteStream] = useState(null);
    const socketRef = useRef(null);
  //  const remoteVideoRef = useRef();
    const [redirect, setRedirect] = useState(false); // State to control redirection
    const [chatIdReceived, setChatIdReceived] = useState(false);
    const [oppositeIdFound, setOppositeIdFound] = useState(false);




   


    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [socket, setSocket] = useState(null); // State for the WebSocket connection
    const videoRef = useRef();

    const [peerId, setPeerId] = useState('');
    const [usernameWithRandom, setusernameWithRandom] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const [sock, setSock] = useState('');

    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);
    //var usernameWithRandom;
    const [peerset, setPeer] = useState(null);
    const myList = []; // Create an empty array

    function genPeer(){
      var currentUser = sessionStorage.getItem('username');
      var randomString = Math.random().toString(36).substring(7);
          const newU= currentUser+randomString
        const peer = new Peer(currentUser);
     
      // peer = new Peer(currentUser);
      setPeer(peer)
      setusernameWithRandom(randomString)
      
    
        console.log("peer ", peer)
        console.log("currentUser ", currentUser)
      //  console.log("peer id " , currentUser)
      return peer;
    }
    useEffect(() => {
    if(socket){
     //genPeer()
    }
  }, [socket]);
  
    useEffect(() => {
     if(socket  ){
   /*   var currentUser = sessionStorage.getItem('username');
      var randomString = Math.random().toString(36).substring(7);
          const newU= currentUser+randomString
      var peer = new Peer(newU);
      setusernameWithRandom(randomString)
      
        console.log("peer ", peer)
        console.log("currentUser ", currentUser)
      //  console.log("peer id " , currentUser)*/
      const peer = genPeer();
      myList.push(peer)
       
        peer.on('open', (  id) => {
         // setPeerId(id)
          // const c setPeerId(id)urrentUser = sessionStorage.getItem('username');
        console.log("user joined the network " , id)
      //  id= currentUser
          setPeerId(id)
          myList.push(id)
        
        });
        console.log("list " , myList)
        peer.on('call', (call) => {
         // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
         navigator.getUserMedia= navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
         var getUserMedia= navigator.getUserMedia
        
          getUserMedia({ video: true, audio: true }, (mediaStream) => {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
            call.answer(mediaStream)
            call.on('stream', function(remoteStream) {
              remoteVideoRef.current.srcObject = remoteStream
              remoteVideoRef.current.play();
            });
          });
        })
    
        peerInstance.current = peer;
      }else{
        console.log("socket null")
      }
      }, [socket])
    
      const call = (remotePeerId) => {
        console.log("calling user " , remotePeerId )
        //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
       navigator.getUserMedia= navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
       var getUserMedia= navigator.getUserMedia
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
    
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
    
          const call = peerInstance.current.call(remotePeerId, mediaStream)
    console.log("the call " , call)
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.play();
          });
        });
      }
    
    
    
    
      
 
    useEffect(() => {
        // Establish WebSocket connection
        
        const newSocket = new WebSocket('wss://10.78.140.215:443');
        newSocket.onopen = () => {
          console.log('WebSocket connection established');
          
          setSocket(newSocket);
        };
        newSocket.onerror = (error) => {
            console.error('WebSocket connection error:', error);
          };

       /* newSocket.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            console.log("event data ", eventData.type);
            if (eventData.type === 'okDONE') {
                console.log("user not in session")
                setRedirect(true)
           console.log("user not in session")
            }else if (eventData.type === 'inSessionResult') {
                // Access the value of v from the WebSocket message
               chatId = eventData.data.v;
               // console.log("Value of id:", chatId);
               setChatIdReceived(true);
                // Use the value of v as needed
            }else {
                console.log("no message recieved")
            }
          };
    */
      
        return () => {
          // Clean up WebSocket connection when component unmounts
          if (newSocket) {
            newSocket.close();
            console.log('WebSocket connection closed');
          }
        };
      }, []); // Run only once on component mount



      const sendInSessionRequest = () => {
        return new Promise((resolve, reject) => {
          if (!socket) {
            reject('WebSocket connection is null');
            return;
          }
      
          const currentUser = sessionStorage.getItem('username');
          socket.send(JSON.stringify({ action: 'inSession?', username: currentUser }));
      
          const handleMessage = (event) => {
            const eventData = JSON.parse(event.data);
            if (eventData.type === 'inSessionResult') {
              chatId = eventData.data.v;
              resolve(chatId);
            } else {
              reject('Unexpected message type');
            }
          };
      
          socket.addEventListener('message', handleMessage);
      
          // Clean up event listener after receiving a response or timeout
          setTimeout(() => {
            socket.removeEventListener('message', handleMessage);
            reject('Timeout exceeded');
          }, 5000); // Adjust timeout as needed
        });
      };
      
      // Usage
      sendInSessionRequest()
        .then((chatId) => {
          //console.log('Received chat ID:', chatId);
          // Do something with the chat ID
          if(chatId===null){
           navigate('/login-as-guest')
           window.location.reload();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
      
useEffect(() => {
    if (chatIdReceived) {
         //checkSession();
         
       
        console.log("called call function")
    }
}, [chatIdReceived]);
          // Listen for 'matchFound' event
         
        function getOppositeID(){
            let oppositeUsername = '';
            let foundUsername = false;
            const currentUser = sessionStorage.getItem('username');

        
            if(chatId!=null){
                console.log("chafunctionnt id inside ", chatId)
            for (let i = 0; i < chatId.length; i++) {
                
                if (chatId[i] === currentUser[0]) {
                    // Check if the substring starting from the current index matches the username
                    if (chatId.substr(i, currentUser.length) === currentUser) {
                        oppositeUsername = chatId.substr(0, i) + chatId.substr(i + currentUser.length);
                        console.log("opposite uer set ", oppositeUsername)
                        foundUsername = true;
                        return oppositeUsername
                        //break;
                    }
                }
            }
            
            if (!foundUsername) {
                for (let i = currentUser.length - 1; i >= 0; i--) {
                    if (chatId.endsWith(currentUser[i])) {
                        // Check if the substring ending at the current index matches the username
                        if (chatId.substr(chatId.length - currentUser.length + i) === currentUser.substr(0, i + 1)) {
                            oppositeUsername = chatId.substr(0, chatId.length - currentUser.length + i);
                            console.log("opposite uer set ", oppositeUsername)
                            return oppositeUsername
                            foundUsername = true;
                            //break;
                        }
                    }
                }
            }

            return oppositeUsername;
            }else {
                console.log("chat id null")
            }
        }

    
      
          useEffect(() => {
            // Redirect to chatbox page if 'redirect' state is true
            if (redirect) {
              console.log("redirecting")
             navigate('/login-as-guest'); // Redirect to the chat route
              // Change '/chatbox' to your chatbox page URL
            }
          }, [redirect, navigate]);



     /*     useEffect(() => {
            const checkSession = async () => {
                try {
                    if (socket && !oppositeIdFound) { // Check if the opposite ID is found
                        const currentUser = sessionStorage.getItem('username');
                        await socket.send(JSON.stringify({ action: 'inSession?', username: currentUser }));
                        console.log("made call to in session?")
                        const oppositeId = getOppositeID();
                        console.log("opposite id " + oppositeId);
                        
                        if (oppositeId) {
                            setRemotePeerIdValue(oppositeId)
                            call(oppositeId);
                            
                            setOppositeIdFound(true); // Set the flag to true once the opposite ID is found
                            return;
                        }
                    } else {
                        console.error('WebSocket connection is null or opposite ID is found');
                    }
                } catch (error) {
                    console.error('Error checking session:', error);
                }
                
                // Schedule the next check only if the opposite ID is not found and the socket is valid
                if (!oppositeIdFound && socket) {
                    setTimeout(checkSession, 1000); // Check session again after 1 second
                }
            };
            
            // Call checkSession() after the component has mounted
            checkSession();
        }, [socket, oppositeIdFound]); // Run only when socket or oppositeIdFound changes
        getoppo
     
        
        */


        var oppositeId
        const checkSession = async () => {
            try {
                if (socket && !oppositeIdFound) {
                    const currentUser = sessionStorage.getItem('username');
                    await socket.send(JSON.stringify({ action: 'inSession?', username: currentUser }));
                    oppositeId = getOppositeID();
                   // setRemotePeerIdValue(oppositeId)
                    if (oppositeId) {
                        setOppositeIdFound(true);
                        setRemotePeerIdValue(oppositeId)
                        console.log("remote peer id val set to " ,oppositeId)
                        return oppositeId;
                    }
                } else {
                    console.error('WebSocket connection is null or opposite ID is found');
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        
            // Schedule the next check only if the opposite ID is not found and the socket is valid
            if (!oppositeIdFound && socket) {
                return new Promise(resolve => setTimeout(() => {
                    checkSession().then(resolve);
                }, 1000));
            }
        };
        

        
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
                // console.log("data " , data)
                
                    // Update chat messages state with the received messages, handle null or undefined messages
                    if (data.data && data.data.messages) { // Check if data.data.messages exists
                        // Update chat messages state with the received messages
                    
                    setChat(data.data.messages || []);
                  
                    setTimeout(handleGetMessages, 500); // Adjust the interval as needed

                    setChat(data.data.messages);
                    } else {
                       
                     //   console.error('Received data does not contain messages:', data);
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
      

  
      /*
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
*/

// Inside the useEffect for WebSocket message handling
// Handle incoming video stream from server
/*useEffect(() => {
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

*/


/*
// Attach remote stream to the video element
useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
        console.log("displaying matched user stream")

      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  // Attach remote stream to the video element
*/

// Attach remote stream to the video element
/*
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
  */
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

           // Stop the user's video stream
      const userMediaStream = currentUserVideoRef.current.srcObject;
      if (userMediaStream) {
        const tracks = userMediaStream.getTracks();
        tracks.forEach(track => track.stop());
      }

      // Disconnect from the PeerJS network
      if (peerInstance.current) {
       
       
        //turn off camera
        peerInstance.current.destroy();
       
      }





         navigate('/login-as-guest');
         peerInstance.current.destroy();
         window.location.reload();

        } else {
          console.error('WebSocket connection is null');
        }
      } catch (error) {
        console.error('Error leaving:', error);
      }
    
  }

  useEffect(() => {
    if(socket){
      checkSession().then((oppositeId) => {
        if (oppositeId) {
            call(oppositeId);
        } else {
            console.error('Opposite ID not found.');
        }
    });
    }
  }, [peerId]);



  return (
    <div className="app-container">
      <div className="video-container">
        <div className="video-left">
          <div className="video-self">
          <video ref={currentUserVideoRef} playsInline={true} muted={true} style={{ objectFit: 'cover' }} />

          </div>
          <div className="video-remote">
            {/* Display the remote user's video feed */}
            {/*remoteStream && <video ref={remoteVideoRef} autoPlay={true} />*/}
            <video ref={remoteVideoRef} autoPlay={true} playsInline={true} muted={false} style={{ objectFit: 'cover' }}/>

           

         
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
           {/* <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />*/}
       { /*     <button onClick={() => {
  checkSession().then((oppositeId) => {
      if (oppositeId) {
          call(oppositeId);
      } else {
          console.error('Opposite ID not found.');
      }
  });
}}>Call</button>*/}
          </div>
          <button className="end-chat-btn" onClick={handleEndChat}>End Chat</button>

        </div>
      </div>
    </div>
  );
}

export default Rchat;