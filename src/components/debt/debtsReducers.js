import {
  DEBTS_UPDATE,
  DEBTS_ADD,
  DEBTS_REMOVE,
  DEBTS_ADD_SEND,
  DEBTS_UPDATE_SEND,
  DEBTS_ERROR,
  DEBTS_LOADING_START,
  DEBTS_LOADING_END,
  DEBTS_VIEWED,
  DEBTS_UPDATED,
  DEBTS_UPDATE_START,
  DEBTS_UPDATE_END,
  DEBTS_CHANGES_LOADED,
  DEBTS_CHANGES_START_LOAD,
  DEBTS_CHANGES_NEW_DEBT,
  PAY_NOTIFICATIONS_RECEIVED,
  PAY_NOTIFICATION_RECEIVED,
  PAY_NOTIFICATION_CONFIRMED,
  CURRENCIES_LOADED
} from "./debtsActions";

const initialState = {
  debts: [],
  payNotifications: [],
  addLoading: false,
  updateLoading: false,
  debtLoading: false,
  updated: false,
  error: "",
  changes: [],
  changesLoading: false,
  debtLoadingId: "",
  hasMore: true,
  hasMoreDebts: true,
  currencies: []
};

export function debtsApp(state = initialState, action) {
  switch (action.type) {
    case DEBTS_UPDATE:
      return Object.assign({}, state, {
        debts: action.rewrite
          ? action.debts
          : [...state.debts, ...action.debts],
        updateLoading: false,
        updated: true,
        hasMoreDebts: action.debts.length === 10
      });
    case DEBTS_UPDATED:
      return Object.assign({}, state, {
        debts: state.debts.map(debt =>
          debt.id === action.debt.id ? action.debt.id : debt
        )
      });

    case DEBTS_ADD:
      return Object.assign({}, state, {
        debts: [...state.debts, action.debt],
        addLoading: false
      });
    case DEBTS_REMOVE:
      return Object.assign({}, state, {
        debts: state.debts.filter(debt => debt.id !== action.id)
      });
    case DEBTS_ADD_SEND:
      return Object.assign({}, state, {
        addLoading: true
      });
    case DEBTS_VIEWED:
      var test = Object.assign([], state.debts);
      return Object.assign({}, state, {
        debts: test.map(debt =>
          debt.id === action.id ? Object.assign(debt, { new: false }) : debt
        )
      });
    case DEBTS_UPDATE_SEND:
      return Object.assign({}, state, {
        updateLoading: true
      });
    case DEBTS_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });
    case DEBTS_LOADING_START:
      return Object.assign({}, state, {
        debtLoading: true
      });
    case DEBTS_LOADING_END:
      return Object.assign({}, state, {
        debtLoading: false
      });
    case DEBTS_UPDATE_START:
      return Object.assign({}, state, {
        debts: Object.assign(
          [],
          state.debts.map(debt =>
            debt.id === action.id
              ? Object.assign(debt, { updating: true })
              : debt
          )
        )
      });
    case DEBTS_UPDATE_END:
      return Object.assign({}, state, {
        debts: state.debts.map(debt =>
          debt.id === action.id
            ? // ? Object.assign(debt, { updating: false }, action.debt)
              action.debt
            : debt
        )
      });
    case DEBTS_CHANGES_LOADED:
      return Object.assign({}, state, {
        changes: [...state.changes, ...action.changes],
        hasMore: action.hasMore,
        changesLoading: false
      });
    case DEBTS_CHANGES_NEW_DEBT:
      return Object.assign({}, state, {
        changes: [],
        changesLoading: true,
        debtLoadingId: action.id,
        hasMore: true
      });
    case DEBTS_CHANGES_START_LOAD:
      return Object.assign({}, state, {
        changesLoading: true
      });
    case PAY_NOTIFICATIONS_RECEIVED:
      return Object.assign({}, state, {
        payNotifications: action.payNotifications
      });
    case PAY_NOTIFICATION_RECEIVED:
      return Object.assign({}, state, {
        payNotifications: [...state.payNotifications, action.payNotification]
      });
    case PAY_NOTIFICATION_CONFIRMED:
      return Object.assign({}, state, {
        payNotifications: state.payNotifications.filter(
          notification => notification.id !== action.payNotificationId
        )
      });
    case CURRENCIES_LOADED:
      return Object.assign({}, state, {
        currencies: action.currencies
      });
    default:
      return state;
  }
}
