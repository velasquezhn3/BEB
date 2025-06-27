# Code Comments and Dependencies for BEB/backend/ Directory

## Overview
This document provides explanations and dependencies for the main JavaScript files in the BEB/backend/ directory, focusing on the WhatsApp integration and backend services.

---

## BEB/backend/whatsapp/messageHandler.js
- Entry point for handling incoming WhatsApp messages via Baileys.
- Delegates message processing to modular state handlers based on user conversation state.
- Uses `stateManager.js` for managing user states and temporary data.
- Imports `handlerRegistry.js` which maps states to handler functions.
- Uses shared services like `userDataManager.js`, `userRoleManager.js`, and `userRelationshipManager.js`.
- Handles role selection, back navigation, and menu options.
- Compatible with Baileys message format.

### Dependencies:
- `stateManager.js`
- `handlerRegistry.js`
- `userDataManager.js`
- `userRoleManager.js`
- `userRelationshipManager.js`
- `utils.js` (for logging)

---

## BEB/backend/whatsapp/stateManager.js
- Manages in-memory user states and temporary user data.
- Provides getter and setter functions for user state and temp data.
- Used by message handlers to track conversation progress.

### Dependencies:
- None (self-contained)

---

## BEB/backend/whatsapp/handlerRegistry.js
- Registers and exports a map of user states to handler functions.
- Imports handler modules from `handlers/` directory.
- Enables modular dispatching of message handling.

### Dependencies:
- `handlers/authHandler.js`
- `handlers/studentHandler.js`
- `handlers/paymentHandler.js`

---

## BEB/backend/whatsapp/handlers/authHandler.js
- Contains handlers for authentication-related states:
  - ASK_NAME, ASK_ID, ASK_PIN, ASK_STUDENT_ID, ASK_STUDENT_PIN, ASK_PROFESSOR_ID
- Handles user input for role registration, PIN validation, and user data saving.
- Uses services for PIN and professor validation.
- Uses `stateManager.js` for state and temp data management.

### Dependencies:
- `userDataManager.js`
- `userRoleManager.js`
- `userPinValidationService.js`
- `userProfessorValidationService.js`
- `studentService.js` (for student lookup)
- `stateManager.js`

---

## BEB/backend/whatsapp/handlers/studentHandler.js
- Contains handlers for student management states:
  - GESTIONAR_ALUMNOS_MENU, AGREGAR_ALUMNO_ID, AGREGAR_ALUMNO_PIN, ELIMINAR_ALUMNO_SELECCION
- Manages adding/removing student relationships.
- Uses `userRelationshipManager.js` and `studentService.js`.
- Uses `stateManager.js` for state tracking.

### Dependencies:
- `userDataManager.js`
- `userRoleManager.js`
- `userRelationshipManager.js`
- `studentService.js`
- `userPinValidationService.js`
- `stateManager.js`

---

## BEB/backend/whatsapp/handlers/paymentHandler.js
- Contains handlers for payment-related states:
  - PAGO_MENU, SELECT_PAGO_STUDENT
- Shows payment information for students.
- Uses `studentService.js` and `debtService.js` for data retrieval and calculations.
- Uses `userRelationshipManager.js` for student associations.
- Uses `stateManager.js` for state management.

### Dependencies:
- `userRoleManager.js`
- `studentService.js`
- `debtService.js`
- `userRelationshipManager.js`
- `stateManager.js`

---

## BEB/backend/whatsapp/userDataManager.js
- Manages persistent user data storage in JSON file.
- Provides functions to get and set user data.
- Uses file system for storage.
- Used by handlers to persist user info.

### Dependencies:
- `utils.js` (for logging)
- Node.js `fs` and `path` modules

---

## BEB/backend/whatsapp/userRelationshipManager.js
- Manages relationships between users (e.g., parents and students).
- Stores data in JSON file.
- Provides functions to add, remove, and get relationships.
- Uses file system for persistence.

### Dependencies:
- `utils.js` (for logging)
- Node.js `fs` and `path` modules

---

## BEB/backend/whatsapp/userPinValidationService.js
- Validates PIN codes for students.
- Reads Excel file `relaciones.xlsx` from storage.
- Uses `exceljs` package to read Excel data.

### Dependencies:
- `exceljs`
- Node.js `path` module

---

## BEB/backend/whatsapp/userProfessorValidationService.js
- Validates professor identity numbers.
- Reads Excel file `profesores.xlsx` from storage.
- Uses `exceljs` package.

### Dependencies:
- `exceljs`
- Node.js `path` module

---

## BEB/backend/services/studentService.js
- Provides functions to lookup student data from Excel file `alumnos.xlsx`.
- Uses `exceljs` to read Excel sheets.
- Used by handlers to get student info.

### Dependencies:
- `exceljs`
- Node.js `path` module

---

## BEB/backend/services/debtService.js
- Calculates student debt and payment status.
- Used by payment handlers to generate payment info.

### Dependencies:
- None external, uses internal logic.

---

## BEB/backend/whatsapp/userRoleManager.js
- Provides menu strings based on user roles.
- Used by message handlers to show role-specific menus.

### Dependencies:
- None

---

## BEB/backend/whatsapp/utils.js
- Utility functions for logging info and errors with timestamps.
- Used across backend modules for consistent logging.

### Dependencies:
- None

---

## BEB/backend/whatsapp/websocketServer.js
- Implements WebSocket server for broadcasting messages (e.g., QR codes).
- Uses `ws` package.
- Used by connection manager or other modules for real-time communication.

### Dependencies:
- `ws` package

---

## BEB/backend/index.js
- Main backend entry point.
- Likely initializes services and WhatsApp connection.
- Depends on `whatsapp/connectionManager.js` and other modules.

---

## BEB/backend/whatsapp/connectionManager.js
- Manages Baileys WhatsApp socket connection.
- Handles authentication, QR code generation, and message event listening.
- Uses `messageHandler.js` to process incoming messages.

### Dependencies:
- `@whiskeysockets/baileys`
- `messageHandler.js`
- `sessionManager.js`
- `websocketServer.js`
- `utils.js`

---

## BEB/backend/whatsapp/sessionManager.js
- Manages Baileys multi-file authentication state.
- Provides functions to get auth state, save credentials, and clear session.

### Dependencies:
- `@whiskeysockets/baileys`
- Node.js `fs` and `path` modules
- `utils.js`

---

## Summary
The BEB/backend/ directory is organized into:

- `whatsapp/` for WhatsApp integration and message handling.
- `services/` for business logic and data access.
- `config/` for configuration files.
- `data/` for data storage (likely).
- `index.js` as the backend entry point.

Each module is well separated with clear responsibilities and dependencies.

This documentation should help understand the purpose and interdependencies of the backend codebase.
