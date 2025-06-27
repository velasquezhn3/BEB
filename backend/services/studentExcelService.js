const ExcelJS = require('exceljs');
const path = require('path');

const storageDir = path.join(__dirname, '../../storage');
const excelFilePath = path.join(storageDir, 'alumnos.xlsx');

async function getWorkbook() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  return workbook;
}

module.exports = {
  getWorkbook
};
