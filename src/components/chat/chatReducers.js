import {
  CHAT_MESSAGE_SENT,
  CHAT_MESSAGE_RECEIVED,
  CHAT_MESSAGES_RECEIVED,
  CHAT_VIEWED,
  CHAT_MESSAGE_APPROVED
} from "./chatActions";

const initialState = {
  messages: [],
  typing: [],
  newMessages: false
};

export function chatApp(state = initialState, action) {
  switch (action.type) {
    case CHAT_MESSAGE_SENT:
      return Object.assign({}, state, {
        messages: [...state.messages, { ...action.message, isOwner: true }]
      });
    case CHAT_MESSAGE_RECEIVED:
      return Object.assign({}, state, {
        messages: [...state.messages, { ...action.message, isOwner: false }],
        newMessages: true
      });
    case CHAT_MESSAGES_RECEIVED:
      return Object.assign({}, state, {
        messages: action.add
          ? [...action.messages, ...state.messages]
          : [...action.messages]
      });
    case CHAT_MESSAGE_APPROVED:
      return Object.assign({}, state, {
        messages: state.messages.map(message =>
          message.tempId === action.tempId ? action.message : message
        )
      });
    case CHAT_VIEWED:
      return Object.assign({}, state, {
        newMessages: false
      });
    default:
      return state;
  }
}
