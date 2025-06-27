/**
 * stateManager.js
 * 
 * Manages userStates and tempUserData for WhatsApp message handling.
 * Provides getter and setter methods to encapsulate state management.
 */

const userStates = new Map();
const tempUserData = new Map();

export function getUserState(userId) {
  return userStates.get(userId) || null;
}

export function setUserState(userId, state) {
  if (state === null || state === undefined) {
    userStates.delete(userId);
  } else {
    userStates.set(userId, state);
  }
}

export function getTempUserData(userId) {
  return tempUserData.get(userId) || null;
}

export function setTempUserData(userId, data) {
  if (data === null || data === undefined) {
    tempUserData.delete(userId);
  } else {
    tempUserData.set(userId, data);
  }
}
