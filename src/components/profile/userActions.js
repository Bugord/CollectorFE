/*
 * action types
 */

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

/*
 * action creators
 */


export function userLogin(user) {
    return { type: USER_LOGIN, user }
}
export function userLogout() {
    return { type: USER_LOGOUT}
}
