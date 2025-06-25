/**
 * websocketServer.js
 * 
 * Implements a WebSocket server to broadcast messages (e.g., QR codes) to connected clients in real-time.
 * Uses the 'ws' package to create the server.
 */

const WebSocket = require('ws');

// Create a WebSocket server on port 8081
const wss = new WebSocket.Server({ port: 8081 });

console.log('WebSocket server created and listening on port 8081'); // Log server start

// Broadcast function to send data to all connected clients
function broadcast(data) {
  console.log('Broadcasting data to clients:', data); // Log broadcast data
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Log when a client connects or disconnects
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Export the broadcast function for use in other modules
module.exports = {
  broadcast,
  wss
};
