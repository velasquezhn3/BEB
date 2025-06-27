const fs = require('fs');
const path = require('path');
const { logError } = require('./utils');

const storageDir = path.join(__dirname, '../../storage');
const relationshipsFilePath = path.join(storageDir, 'relationships.json');

let relationshipsCache = null;

/**
 * Ensure storage directory exists.
 */
function ensureStorageDir() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
}

/**
 * Load relationships data from JSON file into memory cache.
 */
function loadRelationshipsFromFile() {
  if (relationshipsCache) {
    return relationshipsCache;
  }
  try {
    ensureStorageDir();
    if (!fs.existsSync(relationshipsFilePath)) {
      fs.writeFileSync(relationshipsFilePath, JSON.stringify({}), 'utf-8');
    }
    const data = fs.readFileSync(relationshipsFilePath, 'utf-8');
    relationshipsCache = JSON.parse(data);
    return relationshipsCache;
  } catch (error) {
    logError('Error loading relationships from file:', error);
    relationshipsCache = {};
    return relationshipsCache;
  }
}

/**
 * Save relationships data from memory cache to JSON file.
 */
function saveRelationshipsToFile() {
  try {
    ensureStorageDir();
    fs.writeFileSync(relationshipsFilePath, JSON.stringify(relationshipsCache, null, 2), 'utf-8');
  } catch (error) {
    logError('Error saving relationships to file:', error);
  }
}

/**
 * Get students list for an Encargado by their phone number.
 * @param {string} encargadoPhone 
 * @returns {Array<string>} List of student IDs
 */
function getStudentsByEncargado(encargadoPhone) {
  const data = loadRelationshipsFromFile();
  return data[encargadoPhone] || [];
}

/**
 * Add a relationship between Encargado and a student.
 * @param {string} encargadoPhone 
 * @param {string} studentId 
 */
function addRelationship(encargadoPhone, studentId) {
  const data = loadRelationshipsFromFile();
  if (!data[encargadoPhone]) {
    data[encargadoPhone] = [];
  }
  if (!data[encargadoPhone].includes(studentId)) {
    data[encargadoPhone].push(studentId);
    relationshipsCache = data;
    saveRelationshipsToFile();
  }
}

/**
 * Remove a relationship between Encargado and a student.
 * @param {string} encargadoPhone 
 * @param {string} studentId 
 */
function removeRelationship(encargadoPhone, studentId) {
  const data = loadRelationshipsFromFile();
  if (data[encargadoPhone]) {
    data[encargadoPhone] = data[encargadoPhone].filter(id => id !== studentId);
    relationshipsCache = data;
    saveRelationshipsToFile();
  }
}

module.exports = {
  getStudentsByEncargado,
  addRelationship,
  removeRelationship
};
