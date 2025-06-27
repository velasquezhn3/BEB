import { getMenuByRole } from '../userRoleManager.js';
import { getUserData, setUserData } from '../userDataManager.js';
import { buscarEstudiante } from '../../services/studentService.js';
import { validarPIN } from '../userPinValidationService.js';
import { validarProfesor } from '../userProfessorValidationService.js';
import { getUserState, setUserState, getTempUserData, setTempUserData } from '../stateManager.js';

/**
 * Handler for the 'ASK_NAME' state.
 */
export async function handleAskName(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const role = tempData.role;

  if (role === 'Alumno') {
    setUserState(userId, 'ASK_ID');
    await botInstance.sendMessage(userId, { text: 'Por favor, envíe su número de identidad personal.' });
  } else {
    setTempUserData(userId, { ...tempData, name: text });

    if (role === 'Padre/Madre/Tutor') {
      setUserState(userId, 'ASK_STUDENT_ID');
      await botInstance.sendMessage(userId, { text: 'Por favor, envíe el número de identidad del hijo o hija que representa.' });
    } else if (role === 'Docente') {
      setUserState(userId, 'ASK_PROFESSOR_ID');
      await botInstance.sendMessage(userId, { text: 'Por favor, envíe su número de identidad de profesor.' });
    } else {
      // Administración or other roles without ID
      setUserData(userId, getTempUserData(userId));
      setUserState(userId, null);
      setTempUserData(userId, null);
      await botInstance.sendMessage(userId, { text: `Gracias, ${text}. Su información ha sido registrada.\nAquí está su menú:\n${getMenuByRole(role)}` });
    }
  }
}

/**
 * Handler for the 'ASK_ID' state.
 */
export async function handleAskId(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  setTempUserData(userId, { ...tempData, idNumber: text });
  setUserState(userId, 'ASK_PIN');
  await botInstance.sendMessage(userId, { text: 'Por favor, envíe su PIN de validación.' });
}

/**
 * Handler for the 'ASK_PIN' state.
 */
export async function handleAskPin(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const isValid = await validarPIN(tempData.idNumber, text);
  if (isValid) {
    if (tempData.role === 'Alumno') {
      const estudiante = await buscarEstudiante(tempData.idNumber);
      if (estudiante && estudiante.nombre) {
        setTempUserData(userId, { ...tempData, name: estudiante.nombre });
        setUserData(userId, { ...tempData, pin: text, verified: true, name: estudiante.nombre });
        setUserState(userId, null);
        setTempUserData(userId, null);
        await botInstance.sendMessage(userId, { text: `Hola ${estudiante.nombre}, bienvenido. ¿En qué podemos ayudarte?\n${getMenuByRole('Alumno')}` });
        return;
      }
    }
    setUserData(userId, { ...tempData, pin: text, verified: true });
    setUserState(userId, null);
    setTempUserData(userId, null);
    const role = tempData.role || (await getUserData(userId))?.role;
    await botInstance.sendMessage(userId, { text: `Validación exitosa. Aquí está su menú:\n${getMenuByRole(role)}` });
  } else {
    await botInstance.sendMessage(userId, { text: 'Error: La combinación de número de identidad y PIN no es válida. Por favor, intente nuevamente o solicite ayuda.' });
  }
}

/**
 * Handler for the 'ASK_STUDENT_ID' state.
 */
export async function handleAskStudentId(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  setTempUserData(userId, { ...tempData, studentId: text });
  setUserState(userId, 'ASK_STUDENT_PIN');
  await botInstance.sendMessage(userId, { text: 'Por favor, envíe el PIN del alumno.' });
}

/**
 * Handler for the 'ASK_STUDENT_PIN' state.
 */
export async function handleAskStudentPin(botInstance, userId, text) {
  const tempData = getTempUserData(userId) || {};
  const studentId = tempData.studentId;
  const isValid = await validarPIN(studentId, text);
  if (isValid) {
    const { addRelationship } = await import('../userRelationshipManager.js');
    await addRelationship(userId, studentId);
    setUserData(userId, { ...tempData, verified: true });
    setUserState(userId, null);
    setTempUserData(userId, null);
    await botInstance.sendMessage(userId, { text: `Validación exitosa. Relación guardada.\nAquí está su menú:\n${getMenuByRole('Padre/Madre/Tutor')}` });
  } else {
    await botInstance.sendMessage(userId, { text: 'Error: PIN inválido para el alumno. Por favor, intente nuevamente o solicite ayuda.' });
  }
}

/**
 * Handler for the 'ASK_PROFESSOR_ID' state.
 */
export async function handleAskProfessorId(botInstance, userId, text) {
  const isValid = await validarProfesor(text);
  if (isValid) {
    const tempData = getTempUserData(userId) || {};
    setUserData(userId, { ...tempData, idNumber: text, verified: true });
    setUserState(userId, null);
    setTempUserData(userId, null);
    await botInstance.sendMessage(userId, { text: `Validación exitosa. Aquí está su menú:\n${getMenuByRole('Docente')}` });
  } else {
    await botInstance.sendMessage(userId, { text: 'Error: Número de identidad de profesor no válido. Por favor, intente nuevamente o solicite ayuda.' });
  }
}
