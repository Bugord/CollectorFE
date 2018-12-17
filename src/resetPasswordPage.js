import React, { Component } from "react";
import AuthService from "./authService";
import TextField from "./textField";
import { Redirect } from "react-router-dom";
import { Button, Input } from "react-materialize";

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.withToken = props.match.params.token || false;
    this.state = {
      newPassword: "",
      newPasswordRepeat: "",
      newPasswordRepeatError: "",
      newPasswordError: "",
      email: "",
      emailError: "",
      mailSent: false,
      valid: false
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

    if (!this.withToken) {
      if (!this.validateEmail(this.state.email)) {
        if (name === "email")
          this.setState({ emailError: "Your email is not valid" });
        valid = false;
      } else this.setState({ emailError: "" });
    } else {
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
    }
    this.setState({ valid: valid });
  }

  renderEmailSent() {
    return <h4>Mail was sent, please check your email</h4>;
  }

  render() {
    return (
      <div className="authForm">
        {this.state.mailSent
          ? this.renderEmailSent()
          : this.withToken
            ? this.renderWithToken()
            : this.renderWithoutToken()}
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

  renderWithoutToken() {
    return (
      <div>
        <h4>Reset password</h4>
        <h5>Enter email to send reset password link</h5>
        <br />
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={this.state.email}
          valid={(!this.state.emailError).toString()}
          error={this.state.emailError}
          onChange={e => this.onInputChange(e, "email")}
          required
          minLength={3}
          className="input-field"
          validate={true}
        />
        <Button
          type="button"
          className="green lighten-2"
          disabled={!this.state.valid}
          onClick={() => {
            if (!AuthService.loggedIn())
              AuthService.put("api/resetPassword", this.state.email)
                .then(() => this.setState({ mailSent: true }))
                .catch(res => {
                  this.setState({
                    errorMessage: AuthService.handleException(res)
                  });
                });
          }}
        >
          Send email
        </Button>
      </div>
    );
  }

  renderWithToken() {
    if (AuthService.loggedIn()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Reset password</h1>
        <h4>Enter new password</h4>
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
          inputName="Confirm new password"
          errorText={this.state.newPasswordRepeatError}
          onChange={e => this.onInputChange(e, "newPasswordRepeat")}
        />
        <button
          type="button"
          className="button button--green"
          disabled={!this.state.valid}
          onClick={() => {
            if (!AuthService.loggedIn())
              AuthService.put("api/resetPassword", "", {
                token: this.props.match.params.token,
                password: this.state.newPassword
              })
                .then(res => this.props.history.push("/login"))
                .catch(res => {
                  this.setState({
                    errorMessage: AuthService.handleException(res)
                  });
                });
          }}
        >
          Change password
        </button>
      </div>
    );
  }
}

export default ResetPasswordPage;
