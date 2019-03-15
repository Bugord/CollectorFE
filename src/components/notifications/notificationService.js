import AuthService from "../auth/authService";
import { showError } from "../common/helperFunctions";
import { store } from "../../store";
import { notificationGetAll, notificationConfirm } from "./notificationActions";

export function getAllNotificationsAPI() {
  return AuthService.get("api/notifications")
    .then(res => {
      store.dispatch(notificationGetAll(res.data));
    })
    .catch(res => {
      showError(AuthService.handleException(res));
    });
}

export function confirmNotificationAPI(id) {
  return AuthService.put("api/notifications/confirm/" + id)
    .then(res => {
      store.dispatch(notificationConfirm(id));
    })
    .catch(res => {
      showError(AuthService.handleException(res));
    });
}
