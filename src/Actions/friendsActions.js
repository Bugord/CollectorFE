/*
 * action types
 */

export const FRIEND_ADD = "FRIEND_ADD";
export const FRIEND_REMOVE = "FRIEND_REMOVE";
export const FRIEND_UPDATE = "FRIEND_UPDATE";
export const FRIEND_ERROR = "FRIEND_ERROR";
export const FRIEND_INVITES = "FRIEND_INVITES";


/*
 * action creators
 */


export function addFriend(id, name) {
    return { type: FRIEND_ADD, id, name }
}

export function removeFriend(id) {
    return { type: FRIEND_REMOVE, id }
}

export function updateFriends(friends) {
    return { type: FRIEND_UPDATE, friends }
}

export function errorFriend(error) {
    return { type: FRIEND_ERROR, error }
}

export function invitesFriend(invites) {
    return { type: FRIEND_INVITES, invites }
}