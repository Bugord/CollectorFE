import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../authService";
import { connect } from "react-redux";
import TextField from "../textField";

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      oldPasswordError: "",
      newPasswordError: "",
      newPasswordRepeatError: "",
      valid: false
    };
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
    const name = event.target.name;
    var newState = {};
    newState[type] = value;
    this.setState(newState, () => this.validate(name));
  }

  validate(name) {
    var valid = true;
    this.setState({ errorMessage: "" });

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
          newPasswordError: "newPassword must be between 3 an 20"
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

    this.setState({ valid: valid });
  }

  authorizedRender() {
    return (
      <div>
        <h1>Change password</h1>
        <TextField
          type="password"
          name="oldPassword"
          value={this.state.oldPassword}
          valid={!this.state.oldPasswordError}
          inputName="Old password"
          errorText={this.state.oldPasswordError}
          onChange={e => this.onInputChange(e, "oldPassword")}
        />{" "}
        <TextField
          type="password"
          name="newPassword"
          value={this.state.newPassword}
          valid={!this.state.newPasswordError}
          inputName="New password"
          errorText={this.state.newPasswordError}
          onChange={e => this.onInputChange(e, "newPassword")}
        />{" "}
        <TextField
          type="password"
          name="newPasswordRepeat"
          value={this.state.newPasswordRepeat}
          valid={!this.state.newPasswordRepeatError}
          inputName="Repeat new password"
          errorText={this.state.newPasswordRepeatError}
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
      </div>
    );
  }

  renderError() {
    var display = this.state.errorMessage || false;
    return (
      <div className="errorMessage" style={{ display: display ? "" : "none" }}>
        <p>{this.state.errorMessage}</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userApp.user
  };
};

export default (SettingsPage = connect(mapStateToProps)(SettingsPage));
