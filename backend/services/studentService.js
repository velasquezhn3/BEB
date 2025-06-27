/**
 * Servicio para manejo de datos de estudiantes.
 */

const ExcelJS = require('exceljs');
const path = require('path');

let cachedWorkbook = null;

/**
 * Obtiene el workbook cacheado o lo carga si no existe.
 * @returns {Promise<ExcelJS.Workbook>}
 */
async function getWorkbook() {
  if (cachedWorkbook) {
    return cachedWorkbook;
  }
  const workbook = new ExcelJS.Workbook();
  // Updated to use alumnos.xlsx as per user feedback
  const filePath = path.join(__dirname, '../../storage/alumnos.xlsx');
  await workbook.xlsx.readFile(filePath);
  cachedWorkbook = workbook;
  return workbook;
}

/**
 * Busca un estudiante por su ID en el archivo Excel.
 * @param {string} id - ID del estudiante.
 * @returns {Promise<Object|null>} Información del estudiante o null si no encontrado.
 */
async function buscarEstudiante(id) {
  try {
    console.log(`buscarEstudiante: buscando ID ${id}`);
    const workbook = await getWorkbook();

    // Cambiado para obtener siempre la hoja número 6 (índice 5)
    let hoja = workbook.worksheets[5];
    if (!hoja) {
      throw new Error('No se encontró la hoja número 6 en el archivo Excel.');
    }

    // Column mapping as per user provided
    const columnas = {
      NOMBRE: 'A',
      GRADO: 'B',
      ID: 'F',
      MESES: {
        ENERO: 'W', FEBRERO: 'X', MARZO: 'Y', ABRIL: 'Z',
        MAYO: 'AA', JUNIO: 'AB', JULIO: 'AC', AGOSTO: 'AD',
        SEPTIEMBRE: 'AE', OCTUBRE: 'AF', NOVIEMBRE: 'AG', DICIEMBRE: 'AH'
      },
      TOTAL_PAGAR: 'N'
    };

    // Helper to convert column letter to number
    function colLetterToNumber(letter) {
      let col = 0;
      for (let i = 0; i < letter.length; i++) {
        col *= 26;
        col += letter.charCodeAt(i) - 64; // 'A' is 65 in ASCII
      }
      return col;
    }

    let estudiante = null;

    hoja.eachRow((row, rowNumber) => {
      if (rowNumber < 2) return; // Skip header row
      const idRow = row.getCell(colLetterToNumber(columnas.ID)).value?.toString();
      if (idRow === id) {
        const nombre = row.getCell(colLetterToNumber(columnas.NOMBRE)).value;
        const grado = row.getCell(colLetterToNumber(columnas.GRADO)).value;
        const totalPagarCell = row.getCell(colLetterToNumber(columnas.TOTAL_PAGAR)).value;
        const duracionPlanCell = row.getCell(colLetterToNumber('H')).value; // Column H for plan duration

        // Parse totalPagar as number
        let totalPagar = 0;
        if (typeof totalPagarCell === 'number') {
          totalPagar = totalPagarCell;
        } else if (typeof totalPagarCell === 'string') {
          const cleaned = totalPagarCell.replace(/[^0-9.-]+/g, '');
          totalPagar = parseFloat(cleaned) || 0;
        } else if (totalPagarCell && typeof totalPagarCell === 'object') {
          if (totalPagarCell.text) {
            const cleaned = totalPagarCell.text.replace(/[^0-9.-]+/g, '');
            totalPagar = parseFloat(cleaned) || 0;
          } else if (totalPagarCell.result) {
            totalPagar = totalPagarCell.result;
          }
        }

        // Parse duracionPlan as integer
        let duracionPlan = 11; // default
        if (typeof duracionPlanCell === 'number') {
          duracionPlan = duracionPlanCell;
        } else if (typeof duracionPlanCell === 'string') {
          const cleaned = duracionPlanCell.replace(/[^0-9]+/g, '');
          duracionPlan = parseInt(cleaned) || 11;
        }

        // Get monthly payments
        const meses = {};
        for (const [mes, colLetter] of Object.entries(columnas.MESES)) {
          const cellValue = row.getCell(colLetterToNumber(colLetter)).value;
          // Sanitize value to number or null
          let val = null;
          if (cellValue === null || cellValue === undefined) {
            val = null;
          } else if (typeof cellValue === 'number') {
            val = cellValue;
          } else if (typeof cellValue === 'string') {
            const cleaned = cellValue.replace(/[^0-9.-]+/g, '');
            val = parseFloat(cleaned) || null;
          } else if (typeof cellValue === 'object') {
            if (cellValue.text) {
              const cleaned = cellValue.text.replace(/[^0-9.-]+/g, '');
              val = parseFloat(cleaned) || null;
            } else if (cellValue.result) {
              val = typeof cellValue.result === 'number' ? cellValue.result : null;
            }
          }
          meses[mes.toLowerCase()] = val;
        }

        estudiante = {
          nombre,
          grado,
          id,
          meses,
          totalPagar,
          duracionPlan
        };
      }
    });

    if (!estudiante) {
      console.log(`buscarEstudiante: no se encontró el ID ${id}`);
    }

    return estudiante;
  } catch (error) {
    console.error('Error en buscarEstudiante:', error);
    throw error;
  }
}

module.exports = {
  buscarEstudiante
};
