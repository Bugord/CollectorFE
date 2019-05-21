import React, { Component } from "react";
import { updateFriendAPI } from "./friendsService";
import Icon from "react-materialize/lib/Icon";
import Input from "react-materialize/lib/Input";
import swal from "sweetalert";
import Conf from "../../configuration";
import PropTypes from "prop-types";
import { showError, showMessage } from "../common/helperFunctions";

export default class Friend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmailField: false,
      showNameField: false,
      valid: false,
      errorMessage: "",
      email: "",
      emailError: "",
      name: "",
      nameError: ""
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.classNames = "friendBlock collection-item";
    if (this.props.clickable) this.classNames += " friendBlock--hoverable";
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        showEmailField: false,
        showNameField: false,
        valid: false,
        errorMessage: "",
        email: "",
        emailError: "",
        name: "",
        nameError: ""
      });
    }
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

    var emailError = this.state.emailError;
    var nameError = this.state.nameError;

    switch (name) {
      case "email":
        emailError = classNames.includes("invalid") ? "Invalid email" : "";
        break;
      case "name":
        nameError = classNames.includes("invalid") ? "Invalid name" : "";
        break;
      default:
        break;
    }

    this.setState({
      emailError: emailError,
      nameError: nameError
    });
  }

  updateFriend() {
    if (!this.state.showNameField) {
      this.setState({
        showNameField: true,
        showEmailField: false,
        name: this.props.friend.name
      });
    } else {
      updateFriendAPI(this.state.name, this.props.friend.id)
        .then(() => {
          showMessage("Friend name was changed successfully");
          this.setState({ showNameField: false });
        })
        .catch(res => res.forEach(error => showError(error)));
    }
  }

  inviteFriend(friend) {
    if (this.state.email && this.state.showEmailField) {
      this.props
        .onClickInvite(friend.id, this.state.email)
        .then(() => {
          showMessage("Friend invite was sent successfully");
          this.setState({ showEmailField: false });
        })
        .catch(res => res.forEach(error => showError(error)));
    } else {
      this.setState({ showEmailField: true, showNameField: false });
    }
  }

  render() {
    var { friend } = this.props;
    return (
      <li
        className={
          this.props.clickable
            ? "collection-item avatar hoverable"
            : "collection-item avatar"
        }
        onClick={() => {
          if (this.props.clickable) this.props.onClick(friend);
        }}
      >
        <img
          src={
            friend.friendUser
              ? Conf.domain + friend.friendUser.avatarUrl
              : Conf.domain + "images/defaultAvatar.png"
          }
          alt="FriendIcon"
          className="circle"
        />
        <span className="title">
          {friend.name}
          {friend.friendUser ? "(" + friend.friendUser.username + ")" : ""}
        </span>
        {friend.friendUser ? (
          <p>
            {friend.friendUser.firstName} {friend.friendUser.lastName}
            <br />
            {friend.friendUser.email}
          </p>
        ) : (
          ""
        )}
        <div className="debtValue">
          <div className="o1">{friend.owe1}</div>
          <div className="o2">{friend.owe2}</div>
          <div className="o3">{friend.owe2 - friend.owe1}</div>
        </div>

        <form className={this.props.editable ? "secondary-content" : "hide"}>
          <div
            className={
              this.state.showEmailField ? "hide-on-small-only" : "hide"
            }
          >
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={this.state.email}
              error={this.state.emailError}
              onChange={e => this.onInputChange(e)}
              onBlur={e => this.validate(e)}
              required
              minLength={3}
              maxLength={100}
              validate={true}
              s={11}
            />
          </div>
          <div
            className={this.state.showNameField ? "hide-on-small-only" : "hide"}
          >
            <Input
              label="New name"
              type="text"
              name="name"
              placeholder="Enter new name"
              value={this.state.name}
              error={this.state.nameError}
              onChange={e => this.onInputChange(e)}
              onBlur={e => this.validate(e)}
              required
              minLength={3}
              maxLength={100}
              validate={true}
              s={11}
            />
          </div>
          <div
            className={
              friend.isSynchronized ? "hide" : "button__icon hide-on-small-only"
            }
            onClick={() => this.inviteFriend(friend)}
          >
            <Icon>swap_calls</Icon>
          </div>
          <div
            className="button__icon hide-on-small-only"
            onClick={() => this.updateFriend()}
          >
            <Icon>edit</Icon>
          </div>
          <div
            className="button__icon"
            onClick={() => {
              swal({
                title: "Are you sure?",
                text:
                  "You will delete your friend and all debts connected with it",
                icon: "warning",
                buttons: true,
                dangerMode: true
              }).then(willDelete => {
                if (willDelete) {
                  this.props.onClickDelete(friend.id);
                }
              });
            }}
          >
            <Icon>remove_circle</Icon>
          </div>
        </form>
      </li>
    );
  }
}

Friend.propTypes = {
  friend: PropTypes.object,
  clickable: PropTypes.bool,
  editable: PropTypes.bool,
  onClickInvite: PropTypes.func,
  onClickDelete: PropTypes.func
};
