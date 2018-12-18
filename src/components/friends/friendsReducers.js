import {
  FRIEND_ADD,
  FRIEND_REMOVE,
  FRIEND_UPDATE,
  FRIEND_ERROR,
  FRIEND_INVITES,
  FRIEND_UPDATE_SEND,
  FRIEND_SUCCESS_MESSAGE_CLEAR,
  FRIEND_INVITE_SENT,
  FRIEND_UPDATED
} from "./friendsActions";

const initialState = {
  friends: [],
  invites: [],
  loading: false,
  error: "",
  successMessage: ""
};

export function friendsApp(state = initialState, action) {
  switch (action.type) {
    case FRIEND_ADD:
      return Object.assign({}, state, {
        friends: [...state.friends, action.friend],
        successMessage: "Friend added successfully"
      });

    case FRIEND_REMOVE: {
      return Object.assign({}, state, {
        friends: state.friends.filter(friend => friend.id !== action.id),
        successMessage: "Friend removed successfully"
      });
    }
    case FRIEND_SUCCESS_MESSAGE_CLEAR:
      return Object.assign({}, state, {
        successMessage: ""
      });
    case FRIEND_UPDATE:
      return Object.assign({}, state, {
        friends: action.friends,
        loading: false,
        success: true
      });
    case FRIEND_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });
    case FRIEND_INVITES:
      return Object.assign({}, state, {
        invites: action.invites
      });
    case FRIEND_UPDATE_SEND:
      return Object.assign({}, state, {
        loading: true
      });
    case FRIEND_UPDATED:
      return Object.assign({}, state, {
        successMessage: "Friend was updated"
      });
    case FRIEND_INVITE_SENT:
      return Object.assign({}, state, {
        successMessage: "Invite was sent"
      });
    default:
      return state;
  }
}
