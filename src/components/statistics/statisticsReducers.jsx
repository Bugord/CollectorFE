import { PAYMENT_LOAD } from "./statisticsActions";

  const initialState = {
    payments: []
  };
  
  export function statisticsApp(state = initialState, action) {
    switch (action.type) {
      case PAYMENT_LOAD:
        return Object.assign({}, state, { payments: action.payments });
           default:
        return state;
    }
  }
  