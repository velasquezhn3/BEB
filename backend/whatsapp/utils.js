/**
 * utils.js
 * 
 * Utility functions for WhatsApp integration.
 * Includes logging helpers and other common utilities.
 */

/**
 * Log informational messages with timestamp.
 * @param  {...any} args - Arguments to log.
 */
function logInfo(...args) {
  console.log(new Date().toISOString(), '[INFO]', ...args);
}

/**
 * Log error messages with timestamp.
 * @param  {...any} args - Arguments to log.
 */
function logError(...args) {
  console.error(new Date().toISOString(), '[ERROR]', ...args);
}

module.exports = {
  logInfo,
  logError
};
