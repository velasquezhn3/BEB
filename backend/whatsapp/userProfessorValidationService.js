/**
 * Servicio para validación de identidad de profesores.
 * Lee el archivo profesores.xlsx en storage/ y valida identidad.
 */

const ExcelJS = require('exceljs');
const path = require('path');

const profesoresFilePath = path.join(__dirname, '../../storage/profesores.xlsx');

/**
 * Valida el número de identidad del profesor.
 * @param {string} idProfesor - Número de identidad del profesor.
 * @returns {Promise<boolean>} True si el profesor existe.
 */
async function validarProfesor(idProfesor) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(profesoresFilePath);
    const worksheet = workbook.getWorksheet(1);

    let profesorValido = false;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezado
      const idRow = row.getCell(1).value?.toString().trim();
      if (idRow === idProfesor) {
        profesorValido = true;
      }
    });

    return profesorValido;
  } catch (error) {
    console.error('Error al validar profesor:', error);
    return false;
  }
}

module.exports = {
  validarProfesor
};
