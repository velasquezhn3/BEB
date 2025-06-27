import * as authHandler from './handlers/authHandler.js';
import * as studentHandler from './handlers/studentHandler.js';
import * as paymentHandler from './handlers/paymentHandler.js';

export const stateHandlers = {
  // Auth handlers
  'ASK_NAME': authHandler.handleAskName,
  'ASK_ID': authHandler.handleAskId,
  'ASK_PIN': authHandler.handleAskPin,
  'ASK_STUDENT_ID': authHandler.handleAskStudentId,
  'ASK_STUDENT_PIN': authHandler.handleAskStudentPin,
  'ASK_PROFESSOR_ID': authHandler.handleAskProfessorId,

  // Student handlers
  'GESTIONAR_ALUMNOS_MENU': studentHandler.handleGestionarAlumnosMenu,
  'AGREGAR_ALUMNO_ID': studentHandler.handleAgregarAlumnoId,
  'AGREGAR_ALUMNO_PIN': studentHandler.handleAgregarAlumnoPin,
  'ELIMINAR_ALUMNO_SELECCION': studentHandler.handleEliminarAlumnoSeleccion,

  // Payment handlers
  'PAGO_MENU': paymentHandler.handlePagoMenu,
  'SELECT_PAGO_STUDENT': paymentHandler.handleSelectPagoStudent,
};
