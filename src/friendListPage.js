import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "./authService";
import FriendsService from "./friendsService";
import { Input, Button, Icon, Col } from "react-materialize";
import {
  addFriend,
  removeFriend,
  updateFriends,
  errorFriend,
  invitesFriend,
  friendSuccessMessageClear
} from "./Actions/friendsActions";
import { connect } from "react-redux";
import { FriendsList } from "./components/friendsList";
import Row from "react-materialize/lib/Row";

class FriendListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: AuthService.getLogin(),
      friends: [],
      valid: false,
      errorMessage: "",
      friendError: "",
      displayError: false,
      displaySuccess: false,
      friendName: ""
    };

    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.getAllFriends = this.getAllFriends.bind(this);
    this.props.onErrorFriend("");
    this.errorMessage = "";
    this.getAllFriends();
  }

  render() {
    return (
      <div className="MainPage">
        {AuthService.loggedIn() ? (
          this.authorizedRender()
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = {};
    newState[type] = value;
    this.setState(newState, () => this.validate());
  }

  validate() {
    var valid = true;
    var friendError = this.state.friendError;
    this.setState({ displayError: false });
    if (
      this.state.friendName.length < 3 ||
      this.state.friendName.length > 100
    ) {
      friendError = "Name length must be between 3 and 100";
      valid = false;
    } else friendError = "";

    this.setState({ valid: valid, friendError: friendError });
  }
  addFriend() {
    var name = this.state.friendName;
    FriendsService.addFriend(name);
  }

  removeFriend(id) {
    FriendsService.removeFriend(id)
      .then(res => {})
      .catch(res => {
        debugger;
      });
  }

  getAllFriends() {
    FriendsService.getAllFriends();
  }

  inviteFriend(friendId, friendEmail) {
    FriendsService.inviteFriend(friendId, friendEmail);
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
      <div className="container">
        <div className="row">
          <div className="col z-depth-1 grey lighten-4 s12 m12">
            <h5 className="center-align row">Edit your friend list</h5>
            <br />
            <br />
            <div className="col s11">
              <Input
                label="Friend name"
                type="text"
                name="friendName"
                placeholder="Enter friend name"
                value={this.state.friendName}
                valid={(!this.state.friendError).toString()}
                error={this.state.friendError}
                onChange={e => this.onInputChange(e, "friendName")}
                required
                minLength={3}
                validate={true}
                s={12}
              >
                <Icon>person_outline</Icon>
              </Input>
            </div>
            {/* <button
              type="button"
              onClick={this.addFriend}
              disabled={!this.state.valid}
              className="button button--green"
            >
              Add friend
            </button> */}

            <div className="row">
              <Button
                waves="green"
                className="green lighten-2 col s10 offset-s1"
                type="button"
                disabled={!this.state.valid}
                onClick={this.addFriend}
              >
                Add friend
              </Button>
            </div>
            <div className="row">
              <div className="s12">{this.renderError()}</div>
            </div>
            <div className="row">
              <div className="s12"> {this.renderSuccess()}</div>
            </div>
            <Row>
              <Col s={12}>
                <FriendsList
                  friends={this.props.friends}
                  onClickDelete={e => this.removeFriend(e)}
                  onClickInvite={this.inviteFriend}
                  editable={true}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }

  showSuccess() {
    this.setState({ displaySuccess: true });
    setTimeout(() => {
      this.setState({ displaySuccess: false });
      setTimeout(() => this.props.clearSuccessMessage(), 50);
    }, 1500);
  }

  renderError() {
    return (
      <div
        className={
          this.state.displayError
            ? "errorMessage"
            : "errorMessage hide-errorMessage"
        }
      >
        {this.props.error}
        <div
          className="errorMessage__close"
          onClick={() => this.setState({ displayError: false })}
        >
          <Icon>close</Icon>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.successMessage && nextProps.successMessage)
      this.showSuccess();
    if (!this.state.displayError && nextProps.error) {
      this.setState({ displayError: true });
    }
  }

  renderSuccess() {
    return (
      <div
        className={
          this.state.displaySuccess
            ? "errorMessage green lighten-2"
            : "errorMessage green lighten-2 hide-errorMessage"
        }
      >
        <p>{this.props.successMessage}</p>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddFriend: (id, name) => {
      dispatch(addFriend(id, name));
    },
    onUpdateFriends: friends => {
      dispatch(updateFriends(friends));
    },
    onRemoveFriend: id => {
      dispatch(removeFriend(id));
    },
    onErrorFriend: error => {
      dispatch(errorFriend(error));
    },
    onInvitesFriend: invites => {
      dispatch(invitesFriend(invites));
    },
    clearSuccessMessage: () => {
      dispatch(friendSuccessMessageClear());
    }
  };
};
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
    error: state.friendsApp.error,
    invites: state.friendsApp.invites,
    successMessage: state.friendsApp.successMessage
  };
};

export default (FriendListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendListPage));

//  export default MainPage;
