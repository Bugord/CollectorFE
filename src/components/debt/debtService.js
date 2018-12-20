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
  debtChangesLoaded
} from "./debtsActions";
import { hubConnection } from "../../hubConnection";

export function addDebtAPI(debt) {
  store.dispatch(debtsAddSend());
  return AuthService.post("api/addDebt", debt)
    .then(res => {
      store.dispatch(debtsAdd(res.data));
    })
    .catch(res => {
      store.dispatch(debtsError(AuthService.handleException(res)));
    });
}

export function getAllDebtsAPI(debtCount, rewrite, searchObject) {
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

export function getDebtChangesAPI(id, offset, take) {
  return AuthService.get("api/debt/0/changes", {
    id: id,
    offset: offset,
    take: take
  })
    .then(res => {
      store.dispatch(debtChangesLoaded(res.data.changes, res.data.hasMore));
    })
    .catch(() => {
    });
}

export function updateDebtAPI(
  name,
  friendId,
  description,
  synchronize,
  value,
  debtId,
  isOwnerDebter,
  dateOfOverdue,
  isClosed,
  rowVersion,
) {
  // store.dispatch(debtsLoadingStart());
  store.dispatch(debtUpdateStart(debtId));
  return AuthService.put("api/updateDebt", "", {
    name: name,
    friendId: friendId,
    description: description,
    synchronize: synchronize,
    Value: value,
    debtId: debtId,
    isOwnerDebter: isOwnerDebter,
    dateOfOverdue: dateOfOverdue,
    isClosed: isClosed,
    rowVersion: rowVersion
  })
    .then(res => {
      // store.dispatch(debtsLoadingEnd());
      store.dispatch(debtUpdateEnd(debtId, res.data.debt));
      // DebtService.getAllDebts();
    })
    .catch(res => {
      store.dispatch(debtUpdateEnd(debtId));
      if (res.response) {
        if (res.response.data.Name)
          store.dispatch(debtsError(res.response.data.Name[0]));
        if (res.response.data.Value)
          store.dispatch(debtsError(res.response.data.Value[0]));
      } else store.dispatch(debtsError(res.message));
    });
}
