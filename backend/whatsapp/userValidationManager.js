const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { logError } = require('./utils');

const storageDir = path.join(__dirname, '../../storage');
const excelFilePath = path.join(storageDir, 'relaciones.xlsx'); // Updated Excel file name

let validationData = null;

/**
 * Load validation data from Excel file into memory.
 */
function loadValidationData() {
  if (validationData) {
    return validationData;
  }
  try {
    if (!fs.existsSync(excelFilePath)) {
      throw new Error(`Excel file not found at path: ${excelFilePath}`);
    }
    const workbook = xlsx.readFile(excelFilePath);
    console.log('Sheet names:', workbook.SheetNames);
    const sheetName = 'CONSULTA';
    const worksheet = workbook.Sheets[sheetName];
    console.log('Raw worksheet:', worksheet);
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    // Normalize keys by trimming spaces
    const normalizedData = jsonData.map(entry => {
      const newEntry = {};
      for (const key in entry) {
        newEntry[key.trim()] = entry[key];
      }
      return newEntry;
    });
    validationData = normalizedData;
    console.log('Loaded validation data:', validationData);
    return validationData;
  } catch (error) {
    logError('Error loading validation data from Excel:', error);
    validationData = [];
    return validationData;
  }
}

/**
 * Validate ID and PIN pair.
 * @param {string} idNumber 
 * @param {string} pin 
 * @returns {boolean} true if valid, false otherwise
 */
function validateIdPin(idNumber, pin) {
  const data = loadValidationData();
  const idTrim = idNumber.trim();
  // Normalize input PIN: remove commas and convert to number
  const inputPinNormalized = Number(pin.replace(/,/g, ''));
  const isValid = data.some(entry => {
    const entryId = entry['Número de identidad'] ? entry['Número de identidad'].toString().trim() : '';
    let entryPinRaw = entry['PIN'] ? entry['PIN'].toString().trim() : '';
    // Normalize entry PIN: remove commas and convert to number
    const entryPinNormalized = Number(entryPinRaw.replace(/,/g, ''));
    console.log(`Checking entry ID: ${entryId} PIN: ${entryPinNormalized} against input ID: ${idTrim} PIN: ${inputPinNormalized}`);
    return entryId === idTrim && entryPinNormalized === inputPinNormalized;
  });
  console.log(`Validation result for ID: ${idTrim} PIN: ${pin} is ${isValid}`);
  return isValid;
}

module.exports = {
  validateIdPin
};
