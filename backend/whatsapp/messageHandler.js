/**
 * messageHandler.js
 * 
 * Entry point for handling incoming WhatsApp messages.
 * Delegates message processing to modular state handlers.
 */

import { logInfo } from './utils.js';
import { getMenuByRole } from './userRoleManager.js';
import { getUserData } from './userDataManager.js';
import { getStudentsByEncargado } from './userRelationshipManager.js';
import { stateHandlers } from './handlerRegistry.js';
import { getUserState, setUserState, getTempUserData, setTempUserData } from './stateManager.js';

/**
 * Main handler function for incoming messages.
 * Delegates handling to the appropriate state handler based on user state.
 */
export async function handleIncomingMessages(botInstance, msg) {
  try {
    const userId = msg.key.remoteJid;
    let text = '';

    if (msg.message.conversation) {
      text = msg.message.conversation.trim();
    } else if (msg.message.extendedTextMessage) {
      text = msg.message.extendedTextMessage.text.trim();
    }

    if (!text) return;

    logInfo(`Received message from ${userId}: ${text}`);

    // Get user data (role and name) from persistent storage
    let userData = getUserData(userId);

    // Use temp data if userData not fully saved yet
    if (!userData) {
      userData = getTempUserData(userId);
    }

    // Handle back navigation
    if (text.toLowerCase() === 'volver' || text === '0') {
      setUserState(userId, null);
      setTempUserData(userId, null);
      await botInstance.sendMessage(userId, { text: 'Menú principal:\n1. Alumno\n2. Padre/Madre/Tutor\n3. Docente\n4. Administración\nPor favor, seleccione su rol enviando el número o el nombre.' });
      return;
    }

    // Handle user states for multi-step flows
    const state = getUserState(userId);

    if (!userData || !userData.role) {
      // User role not set, expect role selection
      const validRoles = ['Alumno', 'Padre/Madre/Tutor', 'Docente', 'Administración'];
      const roleMap = {
        '1': 'Alumno',
        '2': 'Padre/Madre/Tutor',
        '3': 'Docente',
        '4': 'Administración'
      };

      // Check if input is a number corresponding to a role
      let selectedRole = null;
      if (roleMap[text]) {
        selectedRole = roleMap[text];
      } else if (validRoles.includes(text)) {
        selectedRole = text;
      }

      if (selectedRole) {
        // Save role in temp storage only
        setTempUserData(userId, { role: selectedRole });
        if (selectedRole === 'Alumno') {
          setUserState(userId, 'ASK_ID');
          await botInstance.sendMessage(userId, { text: 'Gracias. Su rol ha sido registrado como Alumno.\nPor favor, envíe su número de identidad personal.' });
        } else {
          setUserState(userId, 'ASK_NAME');
          await botInstance.sendMessage(userId, { text: `Gracias. Su rol ha sido registrado como: ${selectedRole}.\nPor favor, envíe su nombre y apellido.` });
        }
      } else {
        // Ask user to select role with numbers
        const roleOptions = Object.entries(roleMap)
          .map(([num, roleName]) => `${num}. ${roleName}`)
          .join('\n');
        await botInstance.sendMessage(userId, { text: `Por favor, seleccione su rol enviando el número o el nombre:\n${roleOptions}` });
      }
      return;
    }

    // Delegate to the handler function for the current state if exists
    if (state && stateHandlers[state]) {
      await stateHandlers[state](botInstance, userId, text);
      return;
    }

    // If user is verified and has role, show menu and handle options
    if (userData && userData.verified && userData.role) {
      const role = userData.role;
      const menu = getMenuByRole(role);

      switch (role) {
        case 'Alumno':
          if (text === '1') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Ver notas en desarrollo.' });
          } else if (text === '2') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Horarios en desarrollo.' });
          } else if (text === '3') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Contactar a un docente en desarrollo.' });
          } else if (text === '4') {
            // Información de pagos
            setUserState(userId, 'PAGO_MENU');
            await stateHandlers['PAGO_MENU'](botInstance, userId);
          } else {
            await botInstance.sendMessage(userId, { text: `Opción inválida. Por favor seleccione una opción válida:\n${menu}` });
          }
          break;

        case 'Padre/Madre/Tutor':
          if (text === '1') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Ver rendimiento académico en desarrollo.' });
          } else if (text === '2') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Ver asistencia en desarrollo.' });
          } else if (text === '3') {
            // Información de pagos
            setUserState(userId, 'PAGO_MENU');
            await stateHandlers['PAGO_MENU'](botInstance, userId);
          } else if (text === '4') {
            setUserState(userId, 'GESTIONAR_ALUMNOS_MENU');
            const gestionMenu = '1. Agregar alumno\n2. Eliminar alumno\n3. Volver al menú principal';
            await botInstance.sendMessage(userId, { text: `Menú Gestionar Alumnos:\n${gestionMenu}` });
          } else {
            await botInstance.sendMessage(userId, { text: `Opción inválida. Por favor seleccione una opción válida:\n${menu}` });
          }
          break;

        case 'Docente':
          if (text === '1') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Reportar notas en desarrollo.' });
          } else if (text === '2') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Ver horarios de clase en desarrollo.' });
          } else if (text === '3') {
            await botInstance.sendMessage(userId, { text: 'Funcionalidad Comunicados administrativos en desarrollo.' });
          } else {
            await botInstance.sendMessage(userId, { text: `Opción inválida. Por favor seleccione una opción válida:\n${menu}` });
          }
          break;

        default:
          await botInstance.sendMessage(userId, { text: 'Rol no reconocido. Por favor, reinicie la conversación.' });
          setUserState(userId, null);
          setTempUserData(userId, null);
          break;
      }
      return;
    }

    // Default fallback
    await botInstance.sendMessage(userId, { text: 'No se pudo procesar su solicitud. Por favor, intente nuevamente.' });
  } catch (error) {
    console.error('Error handling incoming message:', error);
  }
}
