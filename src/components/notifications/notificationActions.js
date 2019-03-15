/*
 * action types
 */

export const NOTIFICATION_GET_ALL = "NOTIFICATION_GET_ALL";
export const NOTIFICATION_CONFIRM = "NOTIFICATION_CONFIRM";
export const NOTIFICATION_ADD = "NOTIFICATION_ADD";

/*
 * action creators
 */

export function notificationGetAll(notifications) {
  return { type: NOTIFICATION_GET_ALL, notifications };
}

export function notificationConfirm(notificationId) {
  return { type: NOTIFICATION_CONFIRM, notificationId };
}

export function notificationAdd(notification) {
  return { type: NOTIFICATION_ADD, notification };
}
