/**
 * debtService.js
 * 
 * Implements the calcularDeuda function to calculate student debt based on monthly payments,
 * overdue months, and applying a 5% penalty after the 15th of the following month.
 */

const { columnas } = require('../config/config');

/**
 * Sanitiza y convierte un valor de celda a número o null.
 * @param {any} valor - Valor de la celda.
 * @returns {number|null} Valor numérico o null si no es válido.
 */
function sanitizarValorMes(valor) {
  if (valor === null || valor === undefined) return null;

  if (typeof valor === 'number') return valor;

  if (typeof valor === 'string') {
    // Eliminar símbolos de moneda, espacios y comas
    const limpio = valor.replace(/[^0-9.-]+/g, '');
    const numero = parseFloat(limpio);
    return isNaN(numero) ? null : numero;
  }

  if (typeof valor === 'object') {
    if (valor.text) {
      const limpio = valor.text.replace(/[^0-9.-]+/g, '');
      const numero = parseFloat(limpio);
      return isNaN(numero) ? null : numero;
    }
    if (valor.result) {
      return typeof valor.result === 'number' ? valor.result : null;
    }
  }

  return null;
}

/**
 * Calcula la deuda actual de un estudiante.
 * @param {Object} estudiante - Objeto estudiante con información de pagos.
 * @returns {Object} Detalles de deuda y estado de pagos.
 */
function calcularDeuda(estudiante) {
  const ahora = new Date();
  const diaActual = ahora.getDate();
  const mesActual = ahora.getMonth() + 1;
  const anioActual = ahora.getFullYear();

  const meses = Object.keys(columnas.MESES).map((mes, index) => ({
    nombre: mes.toLowerCase(),
    num: index + 1
  }));

  // Determine starting month based on planDePago
  const inicioMes = estudiante.planDePago === 10 ? 2 : 1;

  // Filter months to check for pending payments starting from inicioMes to mesActual
  const mesesPendientes = meses
    .filter(m => m.num >= inicioMes && m.num <= mesActual)
    .filter(m => {
      const valor = estudiante.meses[m.nombre];
      return !valor || valor.toString().trim() === '';
    });

  // Calculate mora (late fee)
  let deudaMora = 0;
  const cuotaMensual = estudiante.totalPagar;

  mesesPendientes.forEach(mesPendiente => {
    // Calculate the due date plus 10 days for the month
    // Due date is the 1st of the next month + 10 days grace period
    let anioMes = anioActual;
    let mesNum = mesPendiente.num;
    // If the month is December and current month is January, adjust year accordingly
    if (mesNum === 12 && mesActual === 1) {
      anioMes = anioActual - 1;
    }
    const fechaVencimiento = new Date(anioMes, mesNum, 11); // month is 0-based, so mesNum is next month index

    if (ahora > fechaVencimiento) {
      deudaMora += cuotaMensual * 0.05;
    }
  });

  const deudaMensualidad = cuotaMensual * mesesPendientes.length;
  const totalDeuda = deudaMensualidad + deudaMora;

  return {
    deudaMensualidad: deudaMensualidad.toFixed(2),
    deudaMora: deudaMora.toFixed(2),
    totalDeuda: totalDeuda.toFixed(2),
    mesesPendientes: mesesPendientes.map(m => m.nombre.toUpperCase()),
    cuotaMensual: cuotaMensual.toFixed(2),
    alDia: mesesPendientes.length === 0
  };
}

module.exports = {
  calcularDeuda
};
