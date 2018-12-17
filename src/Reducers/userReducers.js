import { USER_LOGIN, USER_LOGOUT } from "../Actions/userActions";

const initialState = {
  user: JSON.parse(localStorage.getItem("storage"))
    ? JSON.parse(localStorage.getItem("storage")).userApp.user
    : null
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
