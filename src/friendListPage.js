import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import AuthService from './authService'
import FriendsService from './friendsService'
import TextField from './textField'
import { addFriend, removeFriend, updateFriends, errorFriend, invitesFriend } from './Actions/friendsActions'
import { connect } from 'react-redux'
import { FriendsList } from './components/friendsList'

class FriendListPage extends Component {
    constructor(props) {
        super(props);
        this.state = { login: AuthService.getLogin(), friends: [], valid: false }

        this.addFriend = this.addFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.getAllFriends = this.getAllFriends.bind(this);
        this.props.onErrorFriend("");
        this.getAllFriends();
    }

    render() {
        return (
            <div className="MainPage">
                {AuthService.loggedIn() ? this.authorizedRender() : <Redirect to='/login' />}
            </div>
        )
    }

    onInputChange(event, type) {
        const value = event.target.value;
        var newState = {};
        newState[type] = value;
        this.setState(newState, () => this.validate());
    }

    validate() {
        var valid = true;

        if (this.state.friendName.length < 3 || this.state.friendName.length > 16) {
            this.props.onErrorFriend("Name length must be between 3 and 16")
            valid = false;
        }
        else this.props.onErrorFriend("")

        this.setState({ valid: valid });
    }
    addFriend() {
        var name = this.state.friendName;
        FriendsService.addFriend(name)
            .then(res => { this.props.onAddFriend(res.data.id, name); this.props.onErrorFriend("") })
            .catch(res => { this.props.onErrorFriend(res.message) });
    }

    removeFriend(id) {
        this.props.onRemoveFriend(id);
        FriendsService.removeFriend(id)
            .then(res => { })
            .catch(res => { debugger; });;

    }

    getAllFriends() {
        FriendsService.getAllFriends()
            .then(res => {
                console.log(res.data);
                this.props.onUpdateFriends(res.data.friends);
                this.props.onInvitesFriend(res.data.invites);
                this.props.onErrorFriend("");
            })
            .catch(res => { console.log(res.data); this.props.onErrorFriend(res.message) });
    }

    inviteFriend(friendId) {
        FriendsService.inviteFriend(friendId, 41);
    }

    onInviteDeny(id) {
        debugger;
        FriendsService.approveFriend(id, false);
    }

    onInviteApprove(id) {
        debugger;
        FriendsService.approveFriend(id, true);
    }

    authorizedRender() {
        return (
            // <div className="Layout">
                <div className="form">
                    <TextField type="text" name="friendName" value={this.state.friendName} valid={true} inputName="Friend name" onChange={(e) => this.onInputChange(e, "friendName")} />
                    <button type="button" onClick={this.addFriend} disabled={!this.state.valid} className="button button--green">Add friend</button>
                    <br />
                    <br />
                    <FriendsList friends={this.props.friends} onClickDelete={(e) => this.removeFriend(e)} onClickInvite={(e) => this.inviteFriend(e)} editable={true}/>
                    {this.renderError()}
                    {/* <InvitesList invites={this.props.invites} onInviteDeny={(e) => this.onInviteDeny(e)} onInviteApprove={(e) => this.onInviteApprove(e)} /> */}
                </div>
            // </div>


        )
    }

    renderError() {
        var display = this.props.error || false;
        return (
            <div className="errorMessage" style={{ display: display ? "" : "none" }}>
                <p>{this.props.error}</p>
            </div>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
        onAddFriend: (id, name) => {
            dispatch(addFriend(id, name))
        },
        onUpdateFriends: (friends) => {
            dispatch(updateFriends(friends))
        },
        onRemoveFriend: (id) => {
            dispatch(removeFriend(id))
        },
        onErrorFriend: (error) => {
            dispatch(errorFriend(error))
        },
        onInvitesFriend: (invites) => {
            dispatch(invitesFriend(invites))
        }
    }
}
// const mapDispatchToProps2 = dispatch => {
//     return {
//         onUpdateFriends: (friends) => {
//             dispatch(updateFriends(friends))
//         }
//     }
// }

const mapStateToProps = state => {
    return {
        friends: state.friendsApp.friends,
        error: state.error,
        invites: state.friendsApp.invites
    }
}

export default FriendListPage = connect(
    mapStateToProps,
    mapDispatchToProps

)(FriendListPage)

//  export default MainPage;
