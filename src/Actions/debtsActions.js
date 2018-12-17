/*
 * action types
 */

export const DEBTS_UPDATE = "DEBTS_UPDATE";
export const DEBTS_ADD = "DEBTS_ADD";
export const DEBTS_REMOVE = "DEBTS_REMOVE";
export const DEBTS_ADD_SEND = "DEBTS_ADD_SEND";
export const DEBTS_UPDATE_SEND = "DEBTS_UPDATE_SEND";
export const DEBTS_ERROR = "DEBTS_ERROR";
export const DEBTS_LOADING_START = "DEBTS_LOADING_START";
export const DEBTS_LOADING_END = "DEBTS_LOADING_END";
export const DEBTS_UPDATE_START = "DEBTS_UPDATE_START";
export const DEBTS_UPDATE_END = "DEBTS_UPDATE_END";
export const DEBTS_VIEWED = "DEBTS_VIEWED";
export const DEBTS_UPDATED = "DEBTS_UPDATED";
export const DEBTS_CHANGES_LOADED = "DEBTS_CHANGES_LOADED";
export const DEBTS_CHANGES_NEW_DEBT = "DEBTS_CHANGES_NEW_DEBT";
export const DEBTS_CHANGES_START_LOAD = "DEBTS_CHANGES_START_LOAD";

/*
 * action creators
 */

export function debtsUpdate(debts, rewrite) {
  return { type: DEBTS_UPDATE, debts, rewrite };
}

export function debtsAdd(debt) {
  return { type: DEBTS_ADD, debt };
}

export function debtsRemove(id) {
  return { type: DEBTS_REMOVE, id };
}

export function debtsAddSend() {
  return { type: DEBTS_ADD_SEND };
}

export function debtsUpdateSend() {
  return { type: DEBTS_UPDATE_SEND };
}

export function debtsError(error) {
  return { type: DEBTS_ERROR, error };
}

export function debtsLoadingStart() {
  return { type: DEBTS_LOADING_START };
}

export function debtsLoadingEnd() {
  return { type: DEBTS_LOADING_END };
}

export function debtsViewed(id) {
  return { type: DEBTS_VIEWED, id };
}

export function debtsUpdated(debt) {
  return { type: DEBTS_UPDATED, debt };
}

export function debtUpdateStart(id) {
  return { type: DEBTS_UPDATE_START, id };
}

export function debtUpdateEnd(id, debt) {
   return { type: DEBTS_UPDATE_END, id, debt };
}

export function debtChangesLoaded(changes, hasMore) {
   return { type: DEBTS_CHANGES_LOADED, changes, hasMore };
}
export function debtChangesStartLoad() {
   return { type: DEBTS_CHANGES_START_LOAD};
}
export function debtChangesNewDebt(id) {
   return { type: DEBTS_CHANGES_NEW_DEBT, id};
}
