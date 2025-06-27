# Comentarios y Dependencias del Código en BEB/backend/

## Resumen
Este documento proporciona explicaciones y dependencias para los archivos principales de JavaScript en el directorio BEB/backend/, enfocándose en la integración con WhatsApp y los servicios backend.

---

## BEB/backend/whatsapp/messageHandler.js
- Punto de entrada para el manejo de mensajes entrantes de WhatsApp vía Baileys.
- Delegar el procesamiento de mensajes a manejadores modulares según el estado de la conversación del usuario.
- Utiliza `stateManager.js` para gestionar estados de usuario y datos temporales.
- Importa `handlerRegistry.js` que mapea estados a funciones manejadoras.
- Usa servicios compartidos como `userDataManager.js`, `userRoleManager.js` y `userRelationshipManager.js`.
- Maneja selección de rol, navegación hacia atrás y opciones de menú.
- Compatible con el formato de mensajes de Baileys.

### Dependencias:
- `stateManager.js`
- `handlerRegistry.js`
- `userDataManager.js`
- `userRoleManager.js`
- `userRelationshipManager.js`
- `utils.js` (para logging)

---

## BEB/backend/whatsapp/stateManager.js
- Gestiona en memoria los estados de usuario y datos temporales.
- Proporciona funciones getter y setter para estado y datos temporales.
- Usado por los manejadores para rastrear el progreso de la conversación.

### Dependencias:
- Ninguna (autocontenido)

---

## BEB/backend/whatsapp/handlerRegistry.js
- Registra y exporta un mapa de estados de usuario a funciones manejadoras.
- Importa módulos manejadores desde el directorio `handlers/`.
- Permite el despacho modular del manejo de mensajes.

### Dependencias:
- `handlers/authHandler.js`
- `handlers/studentHandler.js`
- `handlers/paymentHandler.js`

---

## BEB/backend/whatsapp/handlers/authHandler.js
- Contiene manejadores para estados relacionados con autenticación:
  - ASK_NAME, ASK_ID, ASK_PIN, ASK_STUDENT_ID, ASK_STUDENT_PIN, ASK_PROFESSOR_ID
- Maneja la entrada del usuario para registro de rol, validación de PIN y guardado de datos.
- Usa servicios para validación de PIN y profesor.
- Usa `stateManager.js` para gestión de estado y datos temporales.

### Dependencias:
- `userDataManager.js`
- `userRoleManager.js`
- `userPinValidationService.js`
- `userProfessorValidationService.js`
- `studentService.js` (para búsqueda de estudiantes)
- `stateManager.js`

---

## BEB/backend/whatsapp/handlers/studentHandler.js
- Contiene manejadores para estados de gestión de alumnos:
  - GESTIONAR_ALUMNOS_MENU, AGREGAR_ALUMNO_ID, AGREGAR_ALUMNO_PIN, ELIMINAR_ALUMNO_SELECCION
- Gestiona la adición y eliminación de relaciones entre usuarios.
- Usa `userRelationshipManager.js` y `studentService.js`.
- Usa `stateManager.js` para seguimiento de estado.

### Dependencias:
- `userDataManager.js`
- `userRoleManager.js`
- `userRelationshipManager.js`
- `studentService.js`
- `userPinValidationService.js`
- `stateManager.js`

---

## BEB/backend/whatsapp/handlers/paymentHandler.js
- Contiene manejadores para estados relacionados con pagos:
  - PAGO_MENU, SELECT_PAGO_STUDENT
- Muestra información de pagos para estudiantes.
- Usa `studentService.js` y `debtService.js` para datos y cálculos.
- Usa `userRelationshipManager.js` para asociaciones de estudiantes.
- Usa `stateManager.js` para gestión de estado.

### Dependencias:
- `userRoleManager.js`
- `studentService.js`
- `debtService.js`
- `userRelationshipManager.js`
- `stateManager.js`

---

## BEB/backend/whatsapp/userDataManager.js
- Gestiona el almacenamiento persistente de datos de usuario en archivo JSON.
- Proporciona funciones para obtener y establecer datos de usuario.
- Usa sistema de archivos para almacenamiento.
- Usado por manejadores para persistir información de usuario.

### Dependencias:
- `utils.js` (para logging)
- Módulos Node.js `fs` y `path`

---

## BEB/backend/whatsapp/userRelationshipManager.js
- Gestiona relaciones entre usuarios (ej. padres y estudiantes).
- Almacena datos en archivo JSON.
- Proporciona funciones para agregar, eliminar y obtener relaciones.
- Usa sistema de archivos para persistencia.

### Dependencias:
- `utils.js` (para logging)
- Módulos Node.js `fs` y `path`

---

## BEB/backend/whatsapp/userPinValidationService.js
- Valida códigos PIN para estudiantes.
- Lee archivo Excel `relaciones.xlsx` desde storage.
- Usa paquete `exceljs` para leer Excel.

### Dependencias:
- `exceljs`
- Módulo Node.js `path`

---

## BEB/backend/whatsapp/userProfessorValidationService.js
- Valida números de identidad de profesores.
- Lee archivo Excel `profesores.xlsx` desde storage.
- Usa paquete `exceljs`.

### Dependencias:
- `exceljs`
- Módulo Node.js `path`

---

## BEB/backend/services/studentService.js
- Proporciona funciones para buscar datos de estudiantes en archivo Excel `alumnos.xlsx`.
- Usa `exceljs` para leer hojas Excel.
- Usado por manejadores para obtener información de estudiantes.

### Dependencias:
- `exceljs`
- Módulo Node.js `path`

---

## BEB/backend/services/debtService.js
- Calcula deuda y estado de pagos de estudiantes.
- Usado por manejadores de pagos para generar información.

### Dependencias:
- Ninguna externa, usa lógica interna.

---

## BEB/backend/whatsapp/userRoleManager.js
- Proporciona cadenas de menú basadas en roles de usuario.
- Usado por manejadores para mostrar menús específicos por rol.

### Dependencias:
- Ninguna

---

## BEB/backend/whatsapp/utils.js
- Funciones utilitarias para logging de información y errores con timestamp.
- Usado en módulos backend para logging consistente.

### Dependencias:
- Ninguna

---

## BEB/backend/whatsapp/websocketServer.js
- Implementa servidor WebSocket para transmitir mensajes (ej. códigos QR).
- Usa paquete `ws`.
- Usado por connection manager u otros módulos para comunicación en tiempo real.

### Dependencias:
- Paquete `ws`

---

## BEB/backend/index.js
- Punto de entrada principal del backend.
- Probablemente inicializa servicios y conexión WhatsApp.
- Depende de `whatsapp/connectionManager.js` y otros módulos.

---

## BEB/backend/whatsapp/connectionManager.js
- Gestiona la conexión del socket WhatsApp con Baileys.
- Maneja autenticación, generación de QR y escucha de eventos de mensajes.
- Usa `messageHandler.js` para procesar mensajes entrantes.

### Dependencias:
- `@whiskeysockets/baileys`
- `messageHandler.js`
- `sessionManager.js`
- `websocketServer.js`
- `utils.js`

---

## BEB/backend/whatsapp/sessionManager.js
- Gestiona estado de autenticación multi-archivo de Baileys.
- Proporciona funciones para obtener estado de auth, guardar credenciales y limpiar sesión.

### Dependencias:
- `@whiskeysockets/baileys`
- Módulos Node.js `fs` y `path`
- `utils.js`

---

## Resumen
El directorio BEB/backend/ está organizado en:

- `whatsapp/` para integración y manejo de WhatsApp.
- `services/` para lógica de negocio y acceso a datos.
- `config/` para archivos de configuración.
- `data/` para almacenamiento de datos (probablemente).
- `index.js` como punto de entrada del backend.

Cada módulo está bien separado con responsabilidades y dependencias claras.

Este documento debe ayudar a entender el propósito y las interdependencias del código backend.
