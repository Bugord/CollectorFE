/*
 * action types
 */

export const FRIEND_ADD = "FRIEND_ADD";
export const FRIEND_REMOVE = "FRIEND_REMOVE";
export const FRIEND_UPDATE = "FRIEND_UPDATE";
export const FRIEND_ERROR = "FRIEND_ERROR";
export const FRIEND_INVITES = "FRIEND_INVITES";
export const FRIEND_UPDATE_SEND = "FRIEND_UPDATE_SEND";
export const FRIEND_UPDATED = "FRIEND_UPDATED";
export const FRIEND_SUCCESS_MESSAGE_CLEAR = "FRIEND_SUCCESS_MESSAGE_CLEAR";
export const FRIEND_INVITE_SENT = "FRIEND_INVITE_SENT";


/*
 * action creators
 */


export function addFriend(friend) {
    return { type: FRIEND_ADD, friend }
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

export function updateFriendsSend() {
    return { type: FRIEND_UPDATE_SEND}
}

export function friendSuccessMessageClear() {
    return { type: FRIEND_SUCCESS_MESSAGE_CLEAR}
}

export function friendInviteSent() {
    return { type: FRIEND_INVITE_SENT}
}

export function friendUpdated() {
    return { type: FRIEND_UPDATED}
}