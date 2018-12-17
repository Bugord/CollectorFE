import React from "react";
import Popup from "./popup";
import { connect } from "react-redux";
import AuthService from "./authService";
import Axios from "axios";
import Conf from "./configuration";
import { Input, Button, Row, Card } from "react-materialize";

class ChangeProfileDropdown extends Popup {
  constructor(props) {
    super(props);
    let { user } = props;
    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      oldPasswordError: "",
      newPasswordError: "",
      newPasswordRepeatError: "",

      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      firstNameError: "",
      lastNameError: "",
      usernameError: "",
      emailError: "",

      valid: !props.changePassword
    };
  }

  onInputChange(event, type) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[type] = value;
    this.setState(newState, () => this.validate(name));
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  }

  validate(name) {
    var valid = true;
    this.setState({ errorMessage: "" });

    if (this.props.changePassword) {
      if (
        this.state.oldPassword.length < 3 ||
        this.state.oldPassword.length > 20
      ) {
        if (name === "oldPassword")
          this.setState({
            oldPasswordError: "oldPassword must be between 3 an 20"
          });
        valid = false;
      } else this.setState({ oldPasswordError: "" });

      if (
        this.state.newPassword.length < 3 ||
        this.state.newPassword.length > 20
      ) {
        if (name === "newPassword")
          this.setState({
            newPasswordError: "New password must be between 3 an 20"
          });
        valid = false;
      } else this.setState({ newPasswordError: "" });

      if (
        this.state.newPasswordRepeat.length < 3 ||
        this.state.newPasswordRepeat.length > 20
      ) {
        if (name === "newPasswordRepeat")
          this.setState({
            newPasswordRepeatError: "Password must be between 3 an 20"
          });
        valid = false;
      }

      if (this.state.newPasswordRepeat !== this.state.newPassword) {
        if (name === "passwordRepeat" || name === "newPassword")
          this.setState({ newPasswordRepeatError: "Passwords are not equal" });
        valid = false;
      } else this.setState({ newPasswordRepeatError: "" });
    } else {
      if (!this.validateEmail(this.state.email)) {
        if (name === "email")
          this.setState({ emailError: "Your email is not valid" });
        valid = false;
      } else this.setState({ emailError: "" });

      if (this.state.username.length < 3 || this.state.username.length > 16) {
        if (name === "username")
          this.setState({ usernameError: "Username must be between 3 an 16" });
        valid = false;
      } else this.setState({ usernameError: "" });

      if (this.state.firstName.length < 3 || this.state.firstName.length > 16) {
        if (name === "firstName")
          this.setState({
            firstNameError: "First name must be between 3 an 16"
          });
        valid = false;
      } else this.setState({ firstNameError: "" });

      if (this.state.lastName.length < 3 || this.state.lastName.length > 16) {
        if (name === "lastName")
          this.setState({ lastNameError: "Last name must be between 3 an 16" });
        valid = false;
      } else this.setState({ lastNameError: "" });
    }
    this.setState({ valid: valid });
  }

  render2() {
    return (
      <div
        className="popup popup__changeProfileInfo z-depth-2"
        ref={this.setWrapperRef}
      >
        <div
          type="button"
          className="popup__closeButton"
          onClick={this.props.togglePopup}
        >
          ✕
        </div>
        {this.props.changePassword
          ? this.renderChangePassword()
          : this.renderChangeInfo()}
      </div>
    );
  }

  render() {
    return this.props.changePassword
      ? this.renderChangePassword()
      : this.renderChangeInfo();
  }

  renderError() {
    var display = this.state.errorMessage || false;
    return (
      <div className="errorMessage" style={{ display: display ? "" : "none" }}>
        <p>{this.state.errorMessage}</p>
      </div>
    );
  }
  renderChangeInfo() {
    return (
      <Card>
        <h4>Change info</h4>
        {/* <Input
          s={12}
          type="text"
          name="username"
          value={this.state.username}
          valid={(!this.state.usernameError).toString()}
          label="Username"
          validate
          error={this.state.usernameError}
          onChange={e => this.onInputChange(e, "username")}
        /> */}
        <Input
          s={12}
          type="text"
          name="firstName"
          value={this.state.firstName}
          valid={(!this.state.firstNameError).toString()}
          label="First name"
          validate
          error={this.state.firstNameError}
          onChange={e => this.onInputChange(e, "firstName")}
        />
        <Input
          s={12}
          type="text"
          name="lastName"
          value={this.state.lastName}
          valid={(!this.state.lastNameError).toString()}
          label="Last name"
          validate
          error={this.state.lastNameError}
          onChange={e => this.onInputChange(e, "lastName")}
        />
        <Input
          s={12}
          type="email"
          name="email"
          value={this.state.email}
          valid={(!this.state.emailError).toString()}
          label="Email"
          validate
          error={this.state.emailError}
          onChange={e => this.onInputChange(e, "email")}
        />
        <Row>
          <Button
            type="button"
            className="button button--green"
            disabled={!this.state.valid}
            onClick={() => {
              const url = Conf.domain + "api/changeProfile";

              const config = {
                headers: {
                  Authorization: "Bearer " + AuthService.getToken()
                }
              };
              var form = new FormData();
              form.append("username", this.state.username);
              form.append("firstName", this.state.firstName);
              form.append("lastName", this.state.lastName);
              form.append("email", this.state.email);
              Axios.put(url, form, config)
                .then(res => {
                  AuthService.setUser(res.data);
                  // this.props.togglePopup();
                })
                .catch(res => {
                  if (res.response !== undefined)
                    this.setState({ errorMessage: res.response.data.message });
                  else this.setState({ errorMessage: res.message });
                });
            }}
          >
            Save changes
          </Button>
        </Row>
        {this.renderError()}
      </Card>
    );
  }
  renderChangePassword() {
    return (
      <Card>
        <h4>Change password</h4>
        <Input
          s={12}
          type="password"
          name="oldPassword"
          value={this.state.oldPassword}
          valid={(!this.state.oldPasswordError).toString()}
          validate
          label="Old password"
          error={this.state.oldPasswordError}
          onChange={e => this.onInputChange(e, "oldPassword")}
        />
        <Input
          s={12}
          type="password"
          name="newPassword"
          value={this.state.newPassword}
          valid={(!this.state.newPasswordError).toString()}
          validate
          label="New password"
          error={this.state.newPasswordError}
          onChange={e => this.onInputChange(e, "newPassword")}
        />
        <Input
          s={12}
          type="password"
          name="newPasswordRepeat"
          value={this.state.newPasswordRepeat}
          valid={(!this.state.newPasswordRepeatError).toString()}
          validate
          label="Confirm new password"
          error={this.state.newPasswordRepeatError}
          onChange={e => this.onInputChange(e, "newPasswordRepeat")}
        />
        <button
          type="button"
          className="button button--green"
          disabled={!this.state.valid}
          onClick={() =>
            AuthService.put("api/changePassword", "", {
              oldPassword: this.state.oldPassword,
              newPassword: this.state.newPassword
            })
              .then(() => {
                AuthService.logout();
              })
              .catch(res => {
                if (res.response !== undefined)
                  this.setState({ errorMessage: res.response.data.message });
                else this.setState({ errorMessage: res.message });
              })
          }
        >
          Change password
        </button>
        <br />
        <br />
        {this.renderError()}
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userApp.user
  };
};

export default (ChangeProfileDropdown = connect(mapStateToProps)(
  ChangeProfileDropdown
));
