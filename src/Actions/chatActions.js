/*
 * action types
 */

export const CHAT_MESSAGE_SENT = "CHAT_MESSAGE_SENT";
export const CHAT_MESSAGE_RECEIVED = "CHAT_MESSAGE_RECEIVED";
export const CHAT_START_TYPING = "CHAT_START_TYPING";
export const CHAT_STOP_TYPING = "CHAT_STOP_TYPING";
export const CHAT_VIEWED = "CHAT_VIEWED";

/*
 * action creators
 */


export function chatMessageSent(message) {
    return { type: CHAT_MESSAGE_SENT, message }
}
export function chatMessageReceived(message) {
    return { type: CHAT_MESSAGE_RECEIVED, message}
}
export function chatStartTyping(user) {
    return { type: CHAT_START_TYPING, user}
}
export function chatStopTyping(user) {
    return { type: CHAT_STOP_TYPING, user}
}
export function chatViewed() {
    return { type: CHAT_VIEWED}
}