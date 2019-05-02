import {
  NOTIFICATION_GET_ALL,
  NOTIFICATION_CONFIRM,
  NOTIFICATION_ADD
} from "./notificationActions";

const initialState = {
  notifications: []
};

export function notificationsApp(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_GET_ALL:
      return Object.assign({}, state, { notifications: action.notifications });
    case NOTIFICATION_CONFIRM:
      return Object.assign({}, state, {
        notifications: state.notifications.filter(
          notification => notification.id !== action.notificationId
        )
      });
    case NOTIFICATION_ADD:
      return Object.assign({}, state, {
        notifications: [...state.notifications, action.notification]
      });
    default:
      return state;
  }
}
