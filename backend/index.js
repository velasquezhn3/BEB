/**
 * index.js
 * 
 * Entry point for the backend WhatsApp integration.
 * Starts the WhatsApp bot and exports functions for external use.
 */

const { iniciarBot, logoutBot, resetQrFlag } = require('./whatsapp/connectionManager');

// Start the WhatsApp bot on backend startup
iniciarBot()
  .then(() => {
    console.log('WhatsApp bot started successfully.');
  })
  .catch((error) => {
    console.error('Failed to start WhatsApp bot:', error);
  });

module.exports = {
  iniciarBot,
  logoutBot,
  resetQrFlag
};
