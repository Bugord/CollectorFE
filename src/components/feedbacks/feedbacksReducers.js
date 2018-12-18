import {
  FEEDBACKS_GET_ALL,
  FEEDBACKS_GET_BY_ID,
  FEEDBACKS_GET_MESSAGES_BY_ID,
  FEEDBACKS_ADD_MESSAGE,
  FEEDBACKS_ADD_FEEDBACK,
  FEEDBACKS_GET_ALL_LOADING
} from "./feedbacksActions";

const initialState = {
  feedbacks: [],
  messages: [],
  feedbacksLoading: true
};

export function feedbacksApp(state = initialState, action) {
  switch (action.type) {
    case FEEDBACKS_GET_ALL_LOADING:
      return Object.assign({}, state, { feedbacksLoading: true });
    case FEEDBACKS_GET_ALL:
      return Object.assign({}, state, {
        feedbacks: action.feedbacks,
        feedbacksLoading: false
      });
    case FEEDBACKS_GET_BY_ID:
      return Object.assign({}, state, {
        feedbacks: state.feedbacks.find(feedback => feedback.id === action.id)
          ? state.feedbacks.map(feedback =>
              feedback.id === action.id
                ? { ...feedback, ...action.feedback }
                : feedback
            )
          : [...state.feedbacks, action.feedback]
      });
    case FEEDBACKS_GET_MESSAGES_BY_ID:
      return Object.assign({}, state, {
        messages: action.messages
      });
    case FEEDBACKS_ADD_MESSAGE:
      return Object.assign({}, state, {
        messages: [
          ...state.messages,
          {
            ...action.message,
            created: new Date(
              new Date().getTime() + new Date().getTimezoneOffset() * 60000
            )
          }
        ]
      });
    case FEEDBACKS_ADD_FEEDBACK:
      return Object.assign({}, state, {
        feedbacks: [...state.feedbacks, action.feedback]
      });
    default:
      return state;
  }
}
