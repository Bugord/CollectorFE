import AuthService from "../auth/authService";
import { store } from "../../store";
import {
  debtsUpdate,
  debtsAdd,
  debtsRemove,
  debtsAddSend,
  debtsUpdateSend,
  debtsError,
  debtUpdateStart,
  debtUpdateEnd,
  debtChangesLoaded,
  payNotificationsReceived,
  payNotificationConfirmed,
  currenciesLoaded
} from "./debtsActions";
import { hubConnection } from "../../hubConnection";
import { showError } from "../common/helperFunctions";

export function getCurrenciesAPI() {
  store.dispatch(debtsAddSend());
  return AuthService.get("api/getCurrencies")
    .then(res => {
      store.dispatch(currenciesLoaded(res.data));
    })
    .catch(res => {
      showError(AuthService.handleException(res));
    });
}

export function addDebtAPI(debt) {
  store.dispatch(debtsAddSend());
  return AuthService.post("api/addDebt", debt)
    .then(res => {
      store.dispatch(debtsAdd(res.data));
    })
    .catch(res => {
      store.dispatch(debtsError(AuthService.handleException(res)));
      throw AuthService.handleException(res);
    });
}

export function acceptPayNotificationAPI(payNotification) {
  return AuthService.put("api/payNotifications/accept/" + payNotification.id)
    .then(res => {
      store.dispatch(payNotificationConfirmed(payNotification.id));
    })
    .catch(res => {
      showError(AuthService.handleException(res));
    });
}

export function denyPayNotificationAPI(payNotification) {
  return AuthService.put("api/payNotifications/deny/" + payNotification.id)
    .then(res => {
      store.dispatch(payNotificationConfirmed(payNotification.id));
      store.dispatch(debtUpdateEnd(res.data.id, res.data));
    })
    .catch(res => {
      showError(AuthService.handleException(res));
    });
}

export function getPayNotificationsAPI() {
  return AuthService.get("api/payNotifications")
    .then(res => {
      store.dispatch(payNotificationsReceived(res.data));
    })
    .catch(res => {
      showError(AuthService.handleException(res));
    });
}

export function getAllDebtsAPI(debtCount, rewrite = true, searchObject) {
  var search = {};
  searchObject = searchObject || {};
  for (var propertyName in searchObject) {
    var property = searchObject[propertyName];
    search[property.fieldName] = property.value;
  }
  search.offset = rewrite ? 0 : debtCount;
  search.take = 10;
  store.dispatch(debtsUpdateSend());
  return AuthService.post("api/getAllDebts", search)
    .then(res => {
      store.dispatch(debtsUpdate(res.data, rewrite));
    })
    .catch(res => {
      store.dispatch(debtsError(AuthService.handleException(res)));
    });
}

export function removeDebtAPI(debtId, friendId) {
  return AuthService.delete("api/removeDebt", debtId)
    .then(() => {
      store.dispatch(debtsRemove(debtId));
      var username = store
        .getState()
        .friendsApp.friends.filter(friend => friend.id === friendId)[0]
        .username;
      if (username && hubConnection.Connected)
        hubConnection.invoke("UpdateDebts", username);
    })
    .catch(res => {
      store.dispatch(debtsError(AuthService.handleException(res)));
    });
}

export function getDebtByIdAPI(id) {
  return AuthService.get("api/debt/" + id)
    .then(res => {
      store.dispatch(debtUpdateEnd(id, res.data));
    })
    .catch(res => showError(AuthService.handleException(res)));
}

export function getDebtChangesAPI(id, offset, take) {
  return AuthService.get("api/debt/0/changes", {
    id: id,
    offset: offset,
    take: take
  })
    .then(res => {
      store.dispatch(debtChangesLoaded(res.data.changes, res.data.hasMore));
    })
    .catch(() => {});
}

export function payDebtAPI(debtId, value, message) {
  return AuthService.put("api/debt/pay", "", {
    debtId: debtId,
    value: value,
    message: message
  })
    .then(res => {
      store.dispatch(debtUpdateEnd(debtId, { ...res.data, isClosed: false }));
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}

export function updateDebtAPI(
  name,
  friendId,
  description,
  synchronize,
  value,
  currentValue,
  debtId,
  isOwnerDebter,
  isMoney,
  dateOfOverdue,
  isClosed,
  rowVersion,
  friendName,
  currencyId
) {
  store.dispatch(debtUpdateStart(debtId));
  return AuthService.put("api/updateDebt", "", {
    name: name,
    friendId: friendId,
    description: description,
    synchronize: synchronize,
    Value: value,
    currentValue: currentValue,
    debtId: debtId,
    isOwnerDebter: isOwnerDebter,
    isMoney: isMoney,
    dateOfOverdue: dateOfOverdue,
    isClosed: isClosed,
    rowVersion: rowVersion,
    currencyId: currencyId
  })
    .then(res => {
      store.dispatch(debtUpdateEnd(debtId, res.data.debt));
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}
