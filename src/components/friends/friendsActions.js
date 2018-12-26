/*
 * action types
 */

export const FRIEND_ADD = "FRIEND_ADD";
export const FRIEND_REMOVE = "FRIEND_REMOVE";
export const FRIEND_UPDATE = "FRIEND_UPDATE";
export const FRIEND_INVITES = "FRIEND_INVITES";
export const FRIEND_UPDATE_SEND = "FRIEND_UPDATE_SEND";


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

export function invitesFriend(invites) {
    return { type: FRIEND_INVITES, invites }
}

export function updateFriendsSend() {
    return { type: FRIEND_UPDATE_SEND}
}
