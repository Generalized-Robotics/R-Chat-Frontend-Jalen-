import React, { useEffect } from 'react';


const DataConnectionComponent = ({ peer }) => {
  useEffect(() => {
    const connectToPeer = () => {
      // Start a data connection by calling peer.connect with the peer ID
      const conn = peer.connect('dest-peer-id');

      conn.on('open', () => {
        // Receive messages
        conn.on('data', (data) => {
          console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
      });
    };

    connectToPeer();

    return () => {
      // Cleanup if needed
    };
  }, [peer]);

  return <div>Data connection component</div>;
};

export default DataConnectionComponent;
