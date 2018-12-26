import {
  FRIEND_ADD,
  FRIEND_REMOVE,
  FRIEND_UPDATE,
  FRIEND_INVITES,
  FRIEND_UPDATE_SEND,
} from "./friendsActions";

const initialState = {
  friends: [],
  invites: [],
  loading: false,
};

export function friendsApp(state = initialState, action) {
  switch (action.type) {
    case FRIEND_ADD:
      return Object.assign({}, state, {
        friends: [...state.friends, action.friend],
      });

    case FRIEND_REMOVE: {
      return Object.assign({}, state, {
        friends: state.friends.filter(friend => friend.id !== action.id),
      });
    }
    case FRIEND_UPDATE:
      return Object.assign({}, state, {
        friends: action.friends,
        loading: false,
      });
    case FRIEND_INVITES:
      return Object.assign({}, state, {
        invites: action.invites
      });
    case FRIEND_UPDATE_SEND:
      return Object.assign({}, state, {
        loading: true
      });
    default:
      return state;
  }
}
