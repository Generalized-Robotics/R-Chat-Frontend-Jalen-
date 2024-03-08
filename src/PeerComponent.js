import React, { useEffect } from 'react';
import Peer from 'peerjs';


const PeerComponent = () => {
  useEffect(() => {
    // Create a new Peer object
    const peer = new Peer();

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    peer.on('error', (error) => {
      console.error('PeerJS connection error:', error);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return <div>PeerJS initialized</div>;
};

export default PeerComponent;
