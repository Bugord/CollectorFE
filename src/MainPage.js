import React, { Component } from 'react';
import { Link } from "react-router-dom";
import AuthService from './AuthService'
import FriendsService from './FriendsService'
import TextField from './TextField'
import { addFriend, removeFriend, updateFriends, errorFriend, invitesFriend } from './Actions/friendsActions'
import { connect } from 'react-redux'
import {FriendsList} from './components/friendsList'
import { InvitesList } from './components/invitesList';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = { login: AuthService.getLogin(), friends :[], valid: false}

        this.authorizedRender = this.authorizedRender.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.getAllFriends = this.getAllFriends.bind(this);

        if (!this.state.login && AuthService.loggedIn()) {
            AuthService.getInfo((login) => this.setState({ login: login }));
        }

        this.getAllFriends();
    }

    render() {
        return (
            <div className="MainPage">
                {AuthService.loggedIn() ? this.authorizedRender() : <p>Please, <Link to="/login"  className="formLink">log in</Link></p>}
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

        this.setState({valid: valid});
    }
    addFriend() {
        var name = this.state.friendName;
        FriendsService.addFriend(name)
            .then(res => {this.props.onAddFriend(res.data.id, name)})
            .catch(res => { this.props.onErrorFriend(res.message)  });
    }

    removeFriend(id) {
        this.props.onRemoveFriend(id);
        FriendsService.removeFriend(id)
            .then(res => {})
            .catch(res => { debugger; });;
        
    }

    getAllFriends() {
        FriendsService.getAllFriends()
            .then(res => {
                console.log(res.data);
                this.props.onUpdateFriends(res.data.friends);
                this.props.onInvitesFriend(res.data.invites);
            })
            .catch(res => { this.props.onErrorFriend(res.message)  });
    }

    inviteFriend(friendId){
        FriendsService.inviteFriend(friendId, 41);
    }

    onInviteDeny(id)
    {
        debugger;
        FriendsService.approveFriend(id, false);
    }

    onInviteApprove(id)
    {
        debugger;
        FriendsService.approveFriend(id, true);
    }

    authorizedRender() {
        return (
            <div>
                <h2>Welcome, {this.state.login}</h2>
                <br />
                <TextField type="text" name="friendName" value={this.state.friendName} valid={true} inputName="Friend name" onChange={(e) => this.onInputChange(e, "friendName")} />
                <br />
                <button type="button" onClick={this.addFriend} disabled={!this.state.valid}>Add friend</button>
                <br />
                <br />
                <FriendsList friends={this.props.friends} onClickDelete = {(e)=> this.removeFriend(e)} onClickInvite = {(e) => this.inviteFriend(e)} />
                <div className="ErrorMessage">{this.props.error}</div>
                <InvitesList invites={this.props.invites}  onInviteDeny = {(e)=> this.onInviteDeny(e)} onInviteApprove = {(e)=> this.onInviteApprove(e)}/>
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
        friends: state.friends,
        error: state.error,
        invites: state.invites
    }
}

export default MainPage = connect(
    mapStateToProps,
    mapDispatchToProps
    
)(MainPage)

//  export default MainPage;
