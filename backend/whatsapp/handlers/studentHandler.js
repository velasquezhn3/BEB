import { getMenuByRole } from '../userRoleManager.js';
import { getUserData, setUserData } from '../userDataManager.js';
import { buscarEstudiante } from '../../services/studentService.js';
import { getStudentsByEncargado, addRelationship, removeRelationship } from '../userRelationshipManager.js';
import { validarPIN } from '../userPinValidationService.js';
import { getUserState, setUserState, getTempUserData, setTempUserData } from '../stateManager.js';

/**
 * Handler for the 'GESTIONAR_ALUMNOS_MENU' state.
 */
export async function handleGestionarAlumnosMenu(botInstance, userId, text) {
  if (text === '1') {
    setUserState(userId, 'AGREGAR_ALUMNO_ID');
    await botInstance.sendMessage(userId, { text: 'Por favor, envíe el número de identidad del alumno que desea agregar.' });
  } else if (text === '2') {
    const alumnosIds = getStudentsByEncargado(userId);
    if (alumnosIds.length === 0) {
      setUserState(userId, null);
      await botInstance.sendMessage(userId, { text: 'No tiene alumnos registrados para eliminar. Volviendo al menú principal.' });
      return;
    }
    let listaAlumnos = 'Seleccione el número del alumno a eliminar:\n';
    for (let i = 0; i < alumnosIds.length; i++) {
      const estudiante = await buscarEstudiante(alumnosIds[i]);
      const nombre = estudiante ? estudiante.nombre : alumnosIds[i];
      listaAlumnos += `${i + 1}. ${nombre}\n`;
    }
    setUserState(userId, 'ELIMINAR_ALUMNO_SELECCION');
    setTempUserData(userId, { alumnos: alumnosIds });
    await botInstance.sendMessage(userId, { text: listaAlumnos });
  } else if (text === '3') {
    setUserState(userId, null);
    await botInstance.sendMessage(userId, { text: `Volviendo al menú principal:\n${getMenuByRole('Padre/Madre/Tutor')}` });
  } else {
    await botInstance.sendMessage(userId, { text: 'Opción inválida. Por favor seleccione una opción válida del menú Gestionar Alumnos.' });
  }
}

/**
 * Handler for the 'AGREGAR_ALUMNO_ID' state.
 */
export async function handleAgregarAlumnoId(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  setTempUserData(userId, { ...tempData, newStudentId: text });
  setUserState(userId, 'AGREGAR_ALUMNO_PIN');
  await botInstance.sendMessage(userId, { text: 'Por favor, envíe el PIN del alumno para validar.' });
}

/**
 * Handler for the 'AGREGAR_ALUMNO_PIN' state.
 */
export async function handleAgregarAlumnoPin(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const newStudentId = tempData.newStudentId;
  const isValid = await validarPIN(newStudentId, text);
  if (isValid) {
    await addRelationship(userId, newStudentId);
    const alumnos = getStudentsByEncargado(userId);
    const userData = getUserData(userId) || {};
    userData.students = alumnos;
    setUserData(userId, userData);

    setUserState(userId, null);
    setTempUserData(userId, null);
    await botInstance.sendMessage(userId, { text: 'Alumno agregado exitosamente.\nVolviendo al menú principal.' });
    await botInstance.sendMessage(userId, { text: getMenuByRole('Padre/Madre/Tutor') });
  } else {
    await botInstance.sendMessage(userId, { text: 'PIN inválido para el alumno. Por favor, intente nuevamente o solicite ayuda.' });
  }
}

/**
 * Handler for the 'ELIMINAR_ALUMNO_SELECCION' state.
 */
export async function handleEliminarAlumnoSeleccion(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const alumnos = tempData.alumnos || [];
  const index = parseInt(text, 10) - 1;
  if (isNaN(index) || index < 0 || index >= alumnos.length) {
    await botInstance.sendMessage(userId, { text: 'Selección inválida. Por favor, intente nuevamente.' });
    return;
  }
  const alumnoAEliminar = alumnos[index];
  await removeRelationship(userId, alumnoAEliminar);

  const alumnosActualizados = getStudentsByEncargado(userId);
  const userData = getUserData(userId) || {};
  userData.students = alumnosActualizados;
  setUserData(userId, userData);

  setUserState(userId, null);
  setTempUserData(userId, null);
  await botInstance.sendMessage(userId, { text: `Alumno ${alumnoAEliminar} eliminado exitosamente.\nVolviendo al menú principal.` });
  await botInstance.sendMessage(userId, { text: getMenuByRole('Padre/Madre/Tutor') });
}
