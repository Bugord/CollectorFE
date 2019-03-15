/*
 * action types
 */

export const PAYMENT_LOAD = "PAYMENT_LOAD";

/*
 * action creators
 */

export function paymentsGetAll(payments) {
  return { type: PAYMENT_LOAD, payments };
}
