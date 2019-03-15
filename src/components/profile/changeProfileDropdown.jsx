import React from "react";
import Popup from "../common/popup";
import { connect } from "react-redux";
import AuthService from "../auth/authService";
import { Input, Button, Row, Card } from "react-materialize";
import PropTypes from "prop-types";
import { UpdateUserInfo, UpdatePassword } from "./userService";
import { showMessage, showError } from "../common/helperFunctions";

class ChangeProfileDropdown extends Popup {
  constructor(props) {
    super(props);
    let { user } = props;

    this.newPasswordRef = React.createRef();
    this.newPasswordRepeatRef = React.createRef();

    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      oldPasswordError: "",
      newPasswordError: "",
      newPasswordRepeatError: "",

      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      firstNameError: "",
      lastNameError: "",
      emailError: "",

      valid: !props.changePassword
    };
  }

  onInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  }

  validate(event) {
    var classNames = event.target.className;
    var name = event.target.name;

    var emailError = this.state.emailError;
    var newPasswordError = this.state.newPasswordError;
    var oldPasswordError = this.state.oldPasswordError;
    var newPasswordRepeatError = this.state.newPasswordRepeatError;
    var firstNameError = this.state.firstNameError;
    var lastNameError = this.state.lastNameError;

    switch (name) {
      case "firstName":
        firstNameError = classNames.includes("invalid")
          ? "Invalid first name"
          : "";
        break;
      case "lastName":
        lastNameError = classNames.includes("invalid")
          ? "Invalid last name"
          : "";
        break;
      case "email":
        emailError = classNames.includes("invalid") ? "Invalid email" : "";
        break;
      case "oldPassword":
        oldPasswordError = classNames.includes("invalid")
          ? "Invalid old password"
          : "";
        break;
      case "newPassword":
        newPasswordError = classNames.includes("invalid")
          ? "Invalid new password"
          : "";
        break;
      case "newPasswordRepeat":
        newPasswordRepeatError = classNames.includes("invalid")
          ? "Invalid new password repeat"
          : "";
        break;
      default:
        break;
    }

    this.setState({
      emailError: emailError,
      oldPasswordError: oldPasswordError,
      newPasswordError: newPasswordError,
      newPasswordRepeatError: newPasswordRepeatError,
      firstNameError: firstNameError,
      lastNameError: lastNameError
    });
  }

  render() {
    return this.props.changePassword
      ? this.renderChangePassword()
      : this.renderChangeInfo();
  }

  onPasswordChange(event) {
    UpdatePassword(this.state.oldPassword, this.state.newPassword)
      .then(() => {
        AuthService.logout();
        showMessage("Your password was changed, please re-login");
      })
      .catch(res => {
        showError(AuthService.handleException(res));
      });

    event.preventDefault();
  }

  onChangeUserInfo(event) {
    UpdateUserInfo(this.state.firstName, this.state.lastName, this.state.email)
      .then(res => {
        AuthService.setUser(res.data);
        showMessage("Your user info was updated");
      })
      .catch(res => {
        showError(AuthService.handleException(res));
      });

    event.preventDefault();
  }

  validatePassword() {
    var newPassword = this.newPasswordRef.current.input;
    var newPasswordRepeat = this.newPasswordRepeatRef.current.input;
    if (newPassword.value !== newPasswordRepeat.value) {
      newPasswordRepeat.setCustomValidity("Passwords Don't Match");
    } else {
      newPasswordRepeat.setCustomValidity("");
    }
  }

  renderChangeInfo() {
    return (
      <Card>
        <h4>Change info</h4>
        <form onSubmit={e => this.onChangeUserInfo(e)}>
          <Input
            s={12}
            type="text"
            name="firstName"
            value={this.state.firstName}
            label="First name"
            validate
            required
            minLength={3}
            maxLength={100}
            onBlur={e => this.validate(e)}
            error={this.state.firstNameError}
            onChange={e => this.onInputChange(e)}
          />
          <Input
            s={12}
            type="text"
            name="lastName"
            value={this.state.lastName}
            label="Last name"
            validate
            required
            minLength={3}
            maxLength={100}
            onBlur={e => this.validate(e)}
            error={this.state.lastNameError}
            onChange={e => this.onInputChange(e)}
          />
          <Input
            s={12}
            type="email"
            name="email"
            value={this.state.email}
            label="Email"
            validate
            required
            minLength={3}
            maxLength={100}
            onBlur={e => this.validate(e)}
            error={this.state.emailError}
            onChange={e => this.onInputChange(e)}
          />
          <Row>
            <Button
              type="submit"
              className="button button--green"
              disabled={!this.state.valid}
            >
              Save changes
            </Button>
          </Row>
        </form>
      </Card>
    );
  }
  renderChangePassword() {
    return (
      <Card>
        <h4>Change password</h4>
        <form onSubmit={e => this.onPasswordChange(e)}>
          <Input
            s={12}
            type="password"
            name="oldPassword"
            value={this.state.oldPassword}
            minLength={3}
            maxLength={100}
            validate
            required
            label="Old password"
            onBlur={e => this.validate(e)}
            error={this.state.oldPasswordError}
            onChange={e => this.onInputChange(e)}
          />
          <Input
            s={12}
            ref={this.newPasswordRef}
            type="password"
            name="newPassword"
            value={this.state.newPassword}
            minLength={3}
            maxLength={100}
            validate
            required
            label="New password"
            onBlur={e => this.validate(e)}
            error={this.state.newPasswordError}
            onChange={e => {
              this.onInputChange(e);
              this.validatePassword();
            }}
          />
          <Input
            s={12}
            type="password"
            name="newPasswordRepeat"
            ref={this.newPasswordRepeatRef}
            value={this.state.newPasswordRepeat}
            minLength={3}
            maxLength={100}
            validate
            required
            label="Confirm new password"
            onBlur={e => {
              this.validate(e);
              this.validatePassword();
            }}
            error={this.state.newPasswordRepeatError}
            onChange={e => this.onInputChange(e)}
          />
          <Button type="submit" className="green lighten-2">
            Change password
          </Button>
        </form>
        <br />
        <br />
      </Card>
    );
  }
}

ChangeProfileDropdown.propTypes = {
  user: PropTypes.object,
  changePassword: PropTypes.bool,
  togglePopup: PropTypes.func
};

const mapStateToProps = state => {
  return {
    user: state.userApp.user
  };
};

export default (ChangeProfileDropdown = connect(mapStateToProps)(
  ChangeProfileDropdown
));
