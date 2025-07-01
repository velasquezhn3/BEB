import { getMenuByRole } from '../userRoleManager.js';
import { buscarEstudiante } from '../../services/studentService.js';
import { calcularDeuda } from '../../services/debtService.js';
import { getStudentsByEncargado } from '../userRelationshipManager.js';
import { getUserState, setUserState, getTempUserData, setTempUserData } from '../stateManager.js';
import { enqueueMessage } from '../messageQueue.js';

/**
 * Handler for the 'PAGO_MENU' state.
 * Checks number of students and shows menu or info accordingly.
 */
export async function handlePagoMenu(botInstance, userId) {
  const alumnos = getStudentsByEncargado(userId);
  if (alumnos.length === 0) {
    await enqueueMessage(userId, { text: 'No tiene alumnos asociados para mostrar información de pagos.' });
    setUserState(userId, null);
    return;
  }
  if (alumnos.length === 1) {
    // Show payment info directly
    await showPagoInfo(botInstance, userId, alumnos[0]);
    // Comentado para preservar el estado que showPagoInfo puede establecer (POST_PAGO_MENU)
    // setUserState(userId, null);
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
    await enqueueMessage(userId, { text: menu });
  }
}

/**
 * Handler for the 'SELECT_PAGO_STUDENT' state.
 * Processes the selected student and shows payment info.
 */
export async function handleSelectPagoStudent(botInstance, userId, text) {
  console.log(`[handleSelectPagoStudent] userId: ${userId}, text: ${text}`);
  const tempData = getTempUserData(userId) || {};
  const alumnos = tempData.alumnos || [];
  const index = parseInt(text, 10) - 1;
  if (isNaN(index) || index < 0 || index >= alumnos.length) {
    await enqueueMessage(userId, { text: 'Selección inválida. Por favor, intente nuevamente.' });
    return;
  }
  const alumnoSeleccionado = alumnos[index];
  await showPagoInfo(botInstance, userId, alumnoSeleccionado);
  // Comentado para preservar el estado que showPagoInfo puede establecer (POST_PAGO_MENU)
  // setUserState(userId, null);
  // setTempUserData(userId, null);
}

/**
 * Handler for the post-payment menu for users with multiple students.
 */
import { getUserData } from '../userDataManager.js';

export async function handlePostPagoMenu(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const alumnos = tempData.alumnos || [];

  console.log(`[handlePostPagoMenu] userId: ${userId}, text: ${text}, tempData:`, tempData);

  if (text === '1') {
    // Show dynamic menu to consult payment info again
    if (alumnos.length === 0) {
      await enqueueMessage(userId, { text: 'No tiene alumnos asociados para mostrar información de pagos.' });
      setUserState(userId, null);
      setTempUserData(userId, null);
      return;
    }
    let menu = 'Seleccione el alumno para consultar información de pagos:\n';
    for (let i = 0; i < alumnos.length; i++) {
      const estudiante = await buscarEstudiante(alumnos[i]);
      const nombre = estudiante ? estudiante.nombre : alumnos[i];
      menu += `${i + 1}. ${nombre}\n`;
    }
    setUserState(userId, 'SELECT_PAGO_STUDENT');
    setTempUserData(userId, { ...tempData, alumnos }); // Preserve other temp data
    await enqueueMessage(userId, { text: menu });
  } else if (text === '2') {
    // Return to main menu
    setUserState(userId, null);
    setTempUserData(userId, null);
    const userData = getUserData(userId);
    const role = userData?.role;
    if (role) {
      const mainMenu = await getMenuByRole(role, userData.name || '');
      await enqueueMessage(userId, { text: mainMenu });
    } else {
      await enqueueMessage(userId, { text: 'Menú no disponible para su rol.' });
    }
  } else {
    await enqueueMessage(userId, { text: 'Opción inválida. Por favor, seleccione 1 o 2.' });
  }
}

/**
 * Fetches and sends payment information for a student.
 */
async function showPagoInfo(botInstance, userId, studentId) {
  try {
    const estudiante = await buscarEstudiante(studentId);
    if (!estudiante) {
      await enqueueMessage(userId, { text: 'No se encontró información para el alumno seleccionado.' });
      return;
    }


    // Assign planDePago from map or default to 11
    // estudiante.planDePago = planDePagoMap[estudiante.identidad] || 11;

    const deuda = calcularDeuda(estudiante, estudiante.duracionPlan);
    let mensaje = `📊 ESTADO DE PAGOS - ${estudiante.nombre.toUpperCase()}\n`;
    mensaje += `🏫 Grado: ${estudiante.grado}\n\n`;

    const mesesOrden = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Determine starting month index based on planDePago
    // Convert planDePago to number in case it's a string
    const planDePagoNum = Number(estudiante.duracionPlan);
    const inicioMesIndex = planDePagoNum === 10 ? 1 : 0; // febrero index 1, enero index 0

    // Get current month index (0-based)
    const mesActualIndex = new Date().getMonth();

    // Ensure mesActualIndex is not less than inicioMesIndex to avoid empty slice
    const sliceEndIndex = mesActualIndex + 1 > inicioMesIndex ? mesActualIndex + 1 : inicioMesIndex + 1;

    // Slice months array from starting month to current month
    const mesesHastaActualLower = mesesOrden.slice(inicioMesIndex, sliceEndIndex);

    for (const mes of mesesHastaActualLower) {
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
    await enqueueMessage(userId, { text: mensaje });

    // After showing payment info, if user has multiple students, show post-payment menu
    const alumnos = getStudentsByEncargado(userId);
    if (alumnos.length > 1) {
      const menu = 'Seleccione una opción:\n1. Ver información de pago de otro alumno\n2. Volver al menú principal';
      setUserState(userId, 'POST_PAGO_MENU');
      setTempUserData(userId, { alumnos });
      await enqueueMessage(userId, { text: menu });
    } else {
      setUserState(userId, null);
      setTempUserData(userId, null);
    }
  } catch (error) {
    console.error('Error mostrando información de pagos:', error);
    await enqueueMessage(userId, { text: 'Error al obtener la información de pagos. Por favor, intente más tarde.' });
  }
}
