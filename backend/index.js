/**
 * index.js
 * 
 * Entry point for the backend WhatsApp integration.
 * Starts the WhatsApp bot and exports functions for external use.
 */

const express = require('express');
const cors = require('cors');
const { iniciarBot, logoutBot, resetQrFlag } = require('./whatsapp/connectionManager');
const { wss } = require('./whatsapp/websocketServer'); // Import WebSocket server to start it

const app = express();
const port = 3001; // API server port

app.use(cors());
app.use(express.json());

// API endpoint to logout and clear session
app.post('/api/logout', async (req, res) => {
  try {
    await logoutBot();
    resetQrFlag();
    res.json({ success: true, message: 'Logged out and session cleared. Please scan new QR code.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during logout', error: error.message });
  }
});

// Start API server
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});

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
