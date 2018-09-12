import AuthService from './AuthService'
import {store} from './index'
import { updateFriends, invitesFriend } from './Actions/friendsActions'

export default class FriendsService {

    static addFriend(name) {
        return AuthService.request('api/addFriend',
            {
                name: name
            })           
    }

    static removeFriend(friendId) {
        return AuthService.request('api/removeFriend',
            {
                friendId: friendId
            })
    }
   
    static getAllFriends() {
        return AuthService.request('api/getAllFriends').then((res) => {
            store.dispatch(updateFriends(res.data.friends));
            store.dispatch(invitesFriend(res.data.invites));            
        })
    }
    
    static inviteFriend(friendId, userId) {
        return AuthService.request('api/inviteFriend',
        {
            friendId: friendId,
            userId: userId
        })
    }
    static approveFriend(inviteId, approved) {
        return AuthService.request('api/approveFriend',
        {
            inviteId: inviteId,
            approved: approved
        })
    }
}