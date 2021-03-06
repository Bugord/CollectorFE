import AuthService from "../auth/authService";
import { store } from "../../store";
import {
  updateFriends,
  invitesFriend,
  removeFriend,
  updateFriendsSend,
  addFriend
} from "./friendsActions";
import { hubConnection } from "../../hubConnection";
import { getAllDebtsAPI } from "../debt/debtService";

export function addFriendAPI(name) {
  return AuthService.post("api/addFriend", {
    name: name
  })
    .then(res => {
      store.dispatch(addFriend(res.data));
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}

export function removeFriendAPI(friendId) {
  return AuthService.delete("api/removeFriend", friendId)
    .then(() => store.dispatch(removeFriend(friendId)))
    .catch(res => {
      throw AuthService.handleException(res);
    });
}

export function updateFriendAPI(name, id) {
  return AuthService.put("api/updateFriend", "", {
    name: name,
    id: id
  })
    .then(() => {
      getAllFriendsAPI();
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}

export function getAllFriendsAPI() {
  store.dispatch(updateFriendsSend());
  return AuthService.get("api/getAllFriends")
    .then(res => {
      store.dispatch(updateFriends(res.data.friends));
      store.dispatch(invitesFriend(res.data.invites));
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}

export function inviteFriendAPI(friendId, friendEmail) {
  return AuthService.post("api/inviteFriend", {
    friendId: friendId,
    friendEmail: friendEmail
  })
    .then(() => {
      if (hubConnection.Connected)
        hubConnection.invoke("UpdateInvites", friendEmail);
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}

export function acceptFriendAPI(inviteId, accepted, usersName, friendId) {
  return AuthService.post("api/acceptFriend", {
    inviteId: inviteId,
    accepted: accepted,
    usersName: usersName,
    friendId: friendId
  })
    .then(() => {
      getAllFriendsAPI();
      getAllDebtsAPI();
    })
    .catch(res => {
      throw AuthService.handleException(res);
    });
}
