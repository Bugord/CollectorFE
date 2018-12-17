/*
 * action types
 */

export const FEEDBACKS_GET_ALL = "FEEDBACKS_GET_ALL";
export const FEEDBACKS_GET_ALL_LOADING = "FEEDBACKS_GET_ALL_LOADING";
export const FEEDBACKS_GET_BY_ID = "FEEDBACKS_GET_BY_ID";
export const FEEDBACKS_GET_MESSAGES_BY_ID = "FEEDBACKS_GET_MESSAGES_BY_ID";
export const FEEDBACKS_ADD_MESSAGE = "FEEDBACKS_ADD_MESSAGE";
export const FEEDBACKS_ADD_FEEDBACK = "FEEDBACKS_ADD_FEEDBACK";

/*
 * action creators
 */

export function getAllFeedbacks(feedbacks) {
    return { type: FEEDBACKS_GET_ALL, feedbacks}
}

export function getAllFeedbacksLoading() {
    return { type: FEEDBACKS_GET_ALL_LOADING}
}

export function getFeedbackById(id, feedback) {
    return { type: FEEDBACKS_GET_BY_ID, id, feedback}
}

export function getMessagesById(id, messages) {
    return { type: FEEDBACKS_GET_MESSAGES_BY_ID, id, messages}
}

export function addMessage(id, message) {
    return { type: FEEDBACKS_ADD_MESSAGE, id, message}
}

export function addFeedback(feedback) {
    return { type: FEEDBACKS_ADD_FEEDBACK, feedback}
}