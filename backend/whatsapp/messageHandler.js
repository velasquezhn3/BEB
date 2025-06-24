/**
 * messageHandler.js
 * 
 * Processes incoming WhatsApp messages and handles business logic.
 * 
 * This module exports a function to handle messages received from Baileys socket.
 * It extracts sender information and message text, then processes the message.
 * 
 * Dependencies:
 * - None (can add dependencies as needed)
 */

const { logInfo } = require('./utils');

/**
 * Handle incoming WhatsApp messages.
 * Extracts sender and text content, then processes the message.
 * 
 * @param {Object} botInstance - Baileys socket instance.
 * @param {Object} msg - Incoming message object from Baileys.
 */
async function handleIncomingMessages(botInstance, msg) {
  try {
    const remitente = msg.key.remoteJid;
    let texto = '';

    if (msg.message.conversation) {
      texto = msg.message.conversation.trim();
    } else if (msg.message.extendedTextMessage) {
      texto = msg.message.extendedTextMessage.text.trim();
    }

    if (texto) {
      // Placeholder for message processing logic
      // For example, you can add command handling, auto-replies, etc.
      logInfo(`Received message from ${remitente}: ${texto}`);

      // Example: echo the received message back to sender (optional)
      // await botInstance.sendMessage(remitente, { text: `You said: ${texto}` });
    }
  } catch (error) {
    console.error('Error handling incoming message:', error);
  }
}

module.exports = {
  handleIncomingMessages
};
