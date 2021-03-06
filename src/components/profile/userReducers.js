import { USER_LOGIN, USER_LOGOUT } from "./userActions";

const initialState = {
  user: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : {}
};

export function userApp(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        user: action.user
      });
    case USER_LOGOUT:
      return Object.assign({}, state, {
        user: {}
      });
    default:
      return state;
  }
}
