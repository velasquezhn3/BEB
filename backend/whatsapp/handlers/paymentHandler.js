import { getMenuByRole } from '../userRoleManager.js';
import { buscarEstudiante } from '../../services/studentService.js';
import { calcularDeuda } from '../../services/debtService.js';
import { getStudentsByEncargado } from '../userRelationshipManager.js';
import { getUserState, setUserState, getTempUserData, setTempUserData } from '../stateManager.js';

/**
 * Handler for the 'PAGO_MENU' state.
 * Checks number of students and shows menu or info accordingly.
 */
export async function handlePagoMenu(botInstance, userId) {
  const alumnos = getStudentsByEncargado(userId);
  if (alumnos.length === 0) {
    await botInstance.sendMessage(userId, { text: 'No tiene alumnos asociados para mostrar información de pagos.' });
    setUserState(userId, null);
    return;
  }
  if (alumnos.length === 1) {
    // Show payment info directly
    await showPagoInfo(botInstance, userId, alumnos[0]);
    setUserState(userId, null);
  } else {
    // Show menu to select student
    let menu = 'Seleccione el alumno para consultar información de pagos:\n';
    for (let i = 0; i < alumnos.length; i++) {
      const estudiante = await buscarEstudiante(alumnos[i]);
      const nombre = estudiante ? estudiante.nombre : alumnos[i];
      menu += `${i + 1}. ${nombre}\n`;
    }
    setUserState(userId, 'SELECT_PAGO_STUDENT');
    setTempUserData(userId, { alumnos });
    await botInstance.sendMessage(userId, { text: menu });
  }
}

/**
 * Handler for the 'SELECT_PAGO_STUDENT' state.
 * Processes the selected student and shows payment info.
 */
export async function handleSelectPagoStudent(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const alumnos = tempData.alumnos || [];
  const index = parseInt(text, 10) - 1;
  if (isNaN(index) || index < 0 || index >= alumnos.length) {
    await botInstance.sendMessage(userId, { text: 'Selección inválida. Por favor, intente nuevamente.' });
    return;
  }
  const alumnoSeleccionado = alumnos[index];
  await showPagoInfo(botInstance, userId, alumnoSeleccionado);
  setUserState(userId, null);
  setTempUserData(userId, null);
}

/**
 * Fetches and sends payment information for a student.
 */
async function showPagoInfo(botInstance, userId, studentId) {
  try {
    const estudiante = await buscarEstudiante(studentId);
    if (!estudiante) {
      await botInstance.sendMessage(userId, { text: 'No se encontró información para el alumno seleccionado.' });
      return;
    }
    const deuda = calcularDeuda(estudiante);
    let mensaje = `📊 ESTADO DE PAGOS - ${estudiante.nombre.toUpperCase()}\n`;
    mensaje += `🏫 Grado: ${estudiante.grado}\n\n`;

    const mesesOrden = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    for (const mes of mesesOrden) {
      const monto = estudiante.meses[mes];
      const pagado = monto !== null && monto !== undefined && monto !== 0;
      const montoStr = monto ? `L.${monto.toFixed(2)}` : 'L.0.00';
      const statusIcon = pagado ? '✅' : '❌';
      const statusText = pagado ? 'Pagado' : 'Pendiente';
      mensaje += `■ ${mes.charAt(0).toUpperCase() + mes.slice(1)}: ${montoStr} ${statusIcon} ${statusText}\n`;
    }

    mensaje += `\n💵 Cuota mensual: L.${deuda.cuotaMensual}\n`;
    mensaje += `📅 Meses pendientes: ${deuda.mesesPendientes.length}\n\n`;
    mensaje += `❌ DEUDA MENSUALIDAD: L.${deuda.deudaMensualidad}\n`;
    mensaje += `❌ DEUDA MORA: L.${deuda.deudaMora}\n`;
    mensaje += `❌ DEUDA TOTAL: L.${deuda.totalDeuda}\n`;
    mensaje += deuda.alDia ? '✅ Estado: Al día' : '❌ Estado: Con deuda';
    await botInstance.sendMessage(userId, { text: mensaje });
  } catch (error) {
    console.error('Error mostrando información de pagos:', error);
    await botInstance.sendMessage(userId, { text: 'Error al obtener la información de pagos. Por favor, intente más tarde.' });
  }
}
