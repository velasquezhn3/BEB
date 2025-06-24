/**
 * sessionManager.js
 * 
 * Manages WhatsApp session files and credentials using Baileys multi-file auth state.
 * Provides functions to get authentication state, save credentials, and clear session data.
 * 
 * Dependencies:
 * - @whiskeysockets/baileys
 * - fs
 * - path
 */

const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { logInfo, logError } = require('./utils');

/**
 * Get the Baileys multi-file authentication state and saveCreds function.
 * 
 * @param {string} sessionPath - Path to the session directory.
 * @returns {Promise<{state: Object, saveCreds: Function}>} Authentication state and saveCreds function.
 */
async function getAuthState(sessionPath) {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    return { state, saveCreds };
  } catch (error) {
    logError('Error getting auth state:', error);
    throw error;
  }
}

/**
 * Clear session files by deleting the session directory recursively.
 * 
 * @param {string} sessionPath - Path to the session directory.
 * @returns {Promise<void>}
 */
function clearSession(sessionPath) {
  return new Promise((resolve, reject) => {
    fs.rm(sessionPath, { recursive: true, force: true }, (err) => {
      if (err) {
        logError('Error deleting session files:', err);
        reject(err);
      } else {
        logInfo('Session files deleted successfully.');
        resolve();
      }
    });
  });
}

module.exports = {
  getAuthState,
  clearSession
};
