const fs = require('fs');
const path = require('path');
const { logInfo, logError } = require('./utils');

const storageDir = path.join(__dirname, '../../storage');
const dataFilePath = path.join(storageDir, 'userData.json');

let dataCache = null;

/**
 * Ensure storage directory exists.
 */
function ensureStorageDir() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
}

/**
 * Load user data from JSON file into memory cache.
 */
function loadUserDataFromFile() {
  if (dataCache) {
    return dataCache;
  }
  try {
    ensureStorageDir();
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}), 'utf-8');
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    dataCache = JSON.parse(data);
    return dataCache;
  } catch (error) {
    logError('Error loading user data from file:', error);
    dataCache = {};
    return dataCache;
  }
}

/**
 * Save user data from memory cache to JSON file.
 */
function saveUserDataToFile() {
  try {
    ensureStorageDir();
    fs.writeFileSync(dataFilePath, JSON.stringify(dataCache, null, 2), 'utf-8');
  } catch (error) {
    logError('Error saving user data to file:', error);
  }
}

/**
 * Get user data by phone number.
 * @param {string} phoneNumber 
 * @returns {Object|null} user data or null if not found
 */
function getUserData(phoneNumber) {
  const data = loadUserDataFromFile();
  return data[phoneNumber] || null;
}

/**
 * Set user data by phone number.
 * @param {string} phoneNumber 
 * @param {Object} userData 
 */
function setUserData(phoneNumber, userData) {
  const data = loadUserDataFromFile();
  data[phoneNumber] = userData;
  dataCache = data;
  saveUserDataToFile();
}

module.exports = {
  getUserData,
  setUserData
};
