import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../auth/authService";
import {
  addFriendAPI,
  removeFriendAPI,
  getAllFriendsAPI,
  inviteFriendAPI
} from "./friendsService";
import { Input, Button, Icon, Col } from "react-materialize";
import {
  addFriend,
  removeFriend,
  updateFriends,
  invitesFriend
} from "./friendsActions";
import { connect } from "react-redux";
import { FriendsList } from "./friendsList";
import Row from "react-materialize/lib/Row";
import { compose } from "redux";
import PropTypes from "prop-types";
import { showError, showMessage } from "../common/helperFunctions";

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

    this.removeFriend = this.removeFriend.bind(this);
    this.getAllFriends = this.getAllFriends.bind(this);
    this.errorMessage = "";
    this.getAllFriends();
  }

  render() {
    return (
      <div className="MainPage layout">
        {AuthService.loggedIn() ? (
          this.authorizedRender()
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }

  onInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  validate(event) {
    var classNames = event.target.className;
    var name = event.target.name;

    var friendError = this.state.friendError;

    switch (name) {
      case "friendName":
        friendError = classNames.includes("invalid")
          ? "Invalid friend name"
          : "";
        break;
      default:
        break;
    }

    this.setState({
      friendError: friendError
    });
  }

  onAddFriend(event) {
    var name = this.state.friendName;
    addFriendAPI(name)
      .then(() => showMessage("Friend added successfully"))
      .catch(res => res.forEach(error => showError(error)));

    event.preventDefault();
  }

  removeFriend(id) {
    removeFriendAPI(id)
      .then(() => showMessage("Friend removed successfully"))
      .catch(res => res.forEach(error => showError(error)));
  }

  getAllFriends() {
    getAllFriendsAPI().catch(res => res.forEach(error => showError(error)));
  }

  inviteFriend(friendId, friendEmail) {
    return inviteFriendAPI(friendId, friendEmail)
     
  }

  authorizedRender() {
    return (
      <div className="container">
        <div className="row">
          <div className="col z-depth-1 grey lighten-4 s12 m12">
            <h5 className="center-align row">Edit your friend list</h5>
            <br />
            <br />
            <form onSubmit={e => this.onAddFriend(e)}>
              <div className="col s11">
                <Input
                  label="Friend name"
                  type="text"
                  name="friendName"
                  placeholder="Enter friend name"
                  value={this.state.friendName}
                  error={this.state.friendError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => this.validate(e)}
                  required
                  minLength={3}
                  maxLength={100}
                  validate={true}
                  s={12}
                >
                  <Icon>person_outline</Icon>
                </Input>
              </div>
              <div className="row">
                <Button
                  waves="green"
                  className="green lighten-2 col s10 offset-s1"
                  type="submit"
                >
                  Add friend
                </Button>
              </div>
            </form>
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

FriendListPage.propTypes = {
  friends: PropTypes.array,
  error: PropTypes.string,
  invites: PropTypes.array,
  successMessage: PropTypes.string,
  onAddFriend: PropTypes.func,
  onUpdateFriends: PropTypes.func,
  onRemoveFriend: PropTypes.func,
  onInvitesFriend: PropTypes.func
};

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
    onInvitesFriend: invites => {
      dispatch(invitesFriend(invites));
    }
  };
};

const mapStateToProps = state => {
  return {
    friends: state.friendsApp.friends,
    error: state.friendsApp.error,
    invites: state.friendsApp.invites,
    successMessage: state.friendsApp.successMessage
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FriendListPage);
