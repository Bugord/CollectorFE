import { 
    FRIEND_ADD,
    FRIEND_REMOVE,
    FRIEND_UPDATE,
    FRIEND_ERROR,
    FRIEND_INVITES
 } from '../Actions/friendsActions'

const initialState = {
    friends: [],
    invites: []
  };


export function friendsApp(state = initialState, action) {
    switch (action.type) {
    case FRIEND_ADD:
      return Object.assign({}, state, {
        friends: [...state.friends, {
            id: action.id,
            name: action.name
        }]
      })

    case FRIEND_REMOVE:
    {
      var index = state.friends.map(function(item) { return item.id.toString(); }).indexOf(action.id.toString());
      var array = Object.assign([], state.friends, []);
      if(index === -1)
        return state;
      array.splice(index,1);
      return Object.assign({}, state, {
      friends: array
      })
    }
    case FRIEND_UPDATE:
      return Object.assign({}, state, {
        friends: action.friends
      })
    case FRIEND_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })
      case FRIEND_INVITES:
      return Object.assign({}, state, {
        invites: action.invites
      })
    default:
      return state;
}}