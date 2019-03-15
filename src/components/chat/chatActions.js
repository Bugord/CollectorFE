/*
 * action types
 */

export const CHAT_MESSAGE_SENT = "CHAT_MESSAGE_SENT";
export const CHAT_MESSAGE_RECEIVED = "CHAT_MESSAGE_RECEIVED";
export const CHAT_MESSAGE_APPROVED = "CHAT_MESSAGE_APPROVED";
export const CHAT_MESSAGES_RECEIVED = "CHAT_MESSAGES_RECEIVED";
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
export function chatMessageApproved(message, tempId) {
    return { type: CHAT_MESSAGE_APPROVED, message, tempId}
}
export function chatMessagesReceived(messages, add) {
    return { type: CHAT_MESSAGES_RECEIVED, messages, add}
}
export function chatViewed() {
    return { type: CHAT_VIEWED}
}