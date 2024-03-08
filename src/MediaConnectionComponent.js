import React, { useEffect } from 'react';

const MediaConnectionComponent = ({ peer }) => {
  useEffect(() => {
    const callPeer = () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          // Call a peer, providing our mediaStream
          const call = peer.call('dest-peer-id', mediaStream);

          call.on('stream', (stream) => {
            // `stream` is the MediaStream of the remote peer.
            // Here you'd add it to an HTML video/canvas element.
            console.log('Received stream:', stream);
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    };

    callPeer();

    return () => {
      // Cleanup if needed
    };
  }, [peer]);

  return <div>Media connection component</div>;
};

export default MediaConnectionComponent;
