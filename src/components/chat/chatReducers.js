import {
  CHAT_MESSAGE_SENT,
  CHAT_MESSAGE_RECEIVED,
  CHAT_START_TYPING,
  CHAT_STOP_TYPING,
  CHAT_VIEWED
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
    case CHAT_START_TYPING:
      return Object.assign({}, state, {
        typing: [...state.typing, { user: action.user }]
      });
    case CHAT_STOP_TYPING:
      return Object.assign({}, state, {
        typing: state.typing.filter(user => user.user !== action.user)
      });
    case CHAT_VIEWED:
      return Object.assign({}, state, {
        newMessages: false
      });
    default:
      return state;
  }
}
