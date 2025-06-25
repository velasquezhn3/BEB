/**
 * index.js
 * 
 * Entry point for the backend WhatsApp integration.
 * Starts the WhatsApp bot and exports functions for external use.
 */

const { iniciarBot, logoutBot, resetQrFlag } = require('./whatsapp/connectionManager');
const { wss } = require('./whatsapp/websocketServer'); // Import WebSocket server to start it

// Start the WhatsApp bot on backend startup
iniciarBot()
  .then(() => {
    console.log('WhatsApp bot started successfully.');
  })
  .catch((error) => {
    console.error('Failed to start WhatsApp bot:', error);
  });

// Log WebSocket server start
wss.on('listening', () => {
  console.log('WebSocket server started on port 8081');
});

module.exports = {
  iniciarBot,
  logoutBot,
  resetQrFlag
};
