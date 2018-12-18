import AuthService from "../auth/authService";
import { store } from "../../store";
import {
  errorFriend,
  updateFriends,
  invitesFriend,
  removeFriend,
  updateFriendsSend,
  addFriend,
  friendInviteSent,
  friendUpdated
} from "./friendsActions";
import { hubConnection } from "../../hubConnection";
import DebtService from "../debt/debtService";

export default class FriendsService {
  static addFriend(name, callback) {
    return AuthService.post("api/addFriend", {
      name: name
    })
      .then(res => {
        store.dispatch(addFriend(res.data));
      })
      .catch(res =>
        store.dispatch(errorFriend(AuthService.handleException(res)))
      );
  }

  static removeFriend(friendId) {
    return AuthService.delete("api/removeFriend", friendId)
      .then(res => store.dispatch(removeFriend(friendId)))
      .catch(res =>
        store.dispatch(errorFriend(AuthService.handleException(res)))
      );
  }

  static updateFriend(name, id) {
    return AuthService.put("api/updateFriend", "", {
      name: name,
      id: id
    })
      .then(res => {
        FriendsService.getAllFriends();
        store.dispatch(friendUpdated());
      })
      .catch(res =>
        store.dispatch(errorFriend(AuthService.handleException(res)))
      );
  }

  static getAllFriends() {
    store.dispatch(updateFriendsSend());
    return AuthService.get("api/getAllFriends")
      .then(res => {
        store.dispatch(updateFriends(res.data.friends));
        store.dispatch(invitesFriend(res.data.invites));
      })
      .catch(res =>
        store.dispatch(errorFriend(AuthService.handleException(res)))
      );
  }

  static inviteFriend(friendId, friendEmail) {
    return AuthService.post("api/inviteFriend", {
      friendId: friendId,
      friendEmail: friendEmail
    })
      .then(res => {
        store.dispatch(friendInviteSent());
        if (hubConnection.Connected)
          hubConnection.invoke("UpdateInvites", friendEmail);
      })
      .catch(res =>
        store.dispatch(errorFriend(AuthService.handleException(res)))
      );
  }

  static acceptFriend(inviteId, accepted, usersName, friendId) {
    return AuthService.post("api/acceptFriend", {
      inviteId: inviteId,
      accepted: accepted,
      usersName: usersName,
      friendId: friendId
    })
      .then(res => {
        FriendsService.getAllFriends();
        DebtService.getAllDebts();
      })
      .catch(res =>
        store.dispatch(errorFriend(AuthService.handleException(res)))
      );
  }
}
