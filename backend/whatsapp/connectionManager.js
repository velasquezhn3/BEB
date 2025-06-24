/**
 * connectionManager.js
 * 
 * Handles WhatsApp connection setup and management using Baileys library.
 * Manages connection events, QR code generation, reconnection logic, and connection state.
 * 
 * Dependencies:
 * - @whiskeysockets/baileys
 * - qrcode-terminal
 * - qrcode
 * - fs
 * - path
 */

const { default: makeWASocket } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { handleIncomingMessages } = require('./messageHandler');
const { getAuthState, saveCreds, clearSession } = require('./sessionManager');
const { logInfo, logError } = require('./utils');

const dataDir = path.join(__dirname, '..', 'data'); // Directory to store session and QR code data

let qrGenerated = false; // Flag to prevent duplicate QR code generation
let botInstance = null;  // Baileys socket instance
let isConnected = false; // Connection status flag

/**
 * Reset the QR code generated flag.
 * Allows new QR code generation on reconnect.
 */
function resetQrFlag() {
  qrGenerated = false;
}

/**
 * Initialize and start the WhatsApp bot connection.
 * Sets up Baileys socket, event listeners for connection updates, credentials, and messages.
 * Handles QR code generation and saving, connection state changes, and reconnection logic.
 * 
 * @returns {Promise<Object>} The Baileys socket instance (botInstance)
 */
async function iniciarBot() {
  try {
    resetQrFlag();

    // Get authentication state and saveCreds function from sessionManager
    const { state, saveCreds: saveCredentials } = await getAuthState(path.join(dataDir, 'session'));

    // Create Baileys socket connection with auth state and browser info
    botInstance = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: ["Sistema Escolar", "Chrome", "122.0.6261.94"],
      mobile: false
    });

    // Listen for connection updates (QR code, connection status, disconnects)
    botInstance.ev.on('connection.update', (update) => {
      logInfo('Connection update event:', JSON.stringify(update, null, 2));

      if (update.qr) {
        if (!qrGenerated) {
          qrGenerated = true;
          logInfo('QR code event received');
          logInfo('QR code received, scan please:');
          qrcodeTerminal.generate(update.qr, { small: true });

          // Save QR code as text file
          const qrFilePath = path.join(dataDir, 'qr_code.txt');
          qrcodeTerminal.generate(update.qr, { small: true }, (qrString) => {
            fs.writeFile(qrFilePath, qrString, (err) => {
              if (err) {
                logError('Error saving QR code to file:', err);
              } else {
                logInfo(`QR code saved to file: ${qrFilePath}`);
              }
            });
          });

          // Save QR code as PNG file
          const qrPngPath = path.join(dataDir, 'qr_code.png');
          qrcode.toFile(qrPngPath, update.qr, { type: 'png' }, (err) => {
            if (err) {
              logError('Error generating QR code PNG:', err);
            } else {
              logInfo(`QR code PNG saved to file: ${qrPngPath}`);
            }
          });

          // Log QR code data URL
          qrcode.toDataURL(update.qr, (err, url) => {
            if (err) {
              logError('Error generating QR code data URL:', err);
            } else {
              logInfo('QR code data URL:', url);
            }
          });
        } else {
          logInfo('QR code already generated, skipping duplicate generation.');
        }
      }

      if (update.connection) {
        logInfo('Connection update:', update.connection);
        isConnected = update.connection === 'open';
      }

      if (update.lastDisconnect) {
        logInfo('Last disconnect info:', JSON.stringify(update.lastDisconnect, null, 2));
        const statusCode = update.lastDisconnect.error?.output?.statusCode || update.lastDisconnect.statusCode;
        logInfo('Last disconnect status code:', statusCode);

        if (statusCode === 440) {
          logInfo('Conflict detected: another instance is connected with this WhatsApp number. Bot will not restart. Close other instances to resume.');
          return; // Prevent restart on conflict
        }

        if (statusCode === 401) {
          logInfo('Unauthorized, deleting session and restarting...');
          // Delete session files to force re-authentication
          clearSession(path.join(dataDir, 'session'))
            .then(() => {
              logInfo('Session files deleted successfully.');
              setTimeout(iniciarBot, 3000);
            })
            .catch((err) => {
              logError('Error deleting session files:', err);
              setTimeout(iniciarBot, 3000);
            });
          return; // Prevent further restart until deletion completes
        }
      }

      if (update.connection === 'close') {
        logInfo('Connection closed, restarting bot in 3 seconds...');
        isConnected = false;
        setTimeout(iniciarBot, 3000);
      }
    });

    // Listen for credential updates to save them
    botInstance.ev.on('creds.update', saveCredentials);

    // Listen for new messages and delegate to messageHandler
    botInstance.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg.key.fromMe && msg.message) {
        await handleIncomingMessages(botInstance, msg);
      }
    });

    logInfo('🔔 BOT STARTED - SCAN THE QR CODE');
    return botInstance;
  } catch (error) {
    logError('Error starting bot:', error);
    throw error;
  }
}

/**
 * Logout and clear session data.
 * Logs out the bot and deletes session files to force re-authentication.
 */
async function logoutBot() {
  if (botInstance) {
    try {
      await botInstance.logout();
      logInfo("Logout successful. WhatsApp session closed.");
    } catch (e) {
      logError("Error during logout:", e);
    }
  }

  clearSession(path.join(dataDir, 'session'))
    .then(() => {
      logInfo('Session files deleted successfully.');
      setTimeout(iniciarBot, 3000);
    })
    .catch((err) => {
      logError('Error deleting session files:', err);
      setTimeout(iniciarBot, 3000);
    });
}

module.exports = {
  iniciarBot,
  logoutBot,
  resetQrFlag
};
