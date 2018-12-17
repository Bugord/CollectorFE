import React, { Component } from "react";
import AuthService from "../authService";
import { Link } from "react-router-dom";
import { Button, Input } from "react-materialize";
import Icon from "react-materialize/lib/Icon";

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordRepeat: "",
      username: "",
      firstName: "",
      lastName: "",
      emailError: "",
      passwordError: "",
      passwordRepeatError: "",
      usernameError: "",
      firstNameError: "",
      lastNameError: "",
      displayError: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.validate = this.validate.bind(this);
    this.renderError = this.renderError.bind(this);
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
    var emailError = this.state.emailError;
    var emailErrors = [];

    this.setState({ errorMessage: "", displayError: false });

    if (!this.validateEmail(this.state.email)) {
      if (name === "email") emailErrors.push("Your email is not valid");
      valid = false;
    }

    if (this.state.email.length < 3 || this.state.email.length > 100) {
      if (name === "email") emailErrors.push("Email must be between 3 an 100");
      valid = false;
    }

    if (this.state.password.length < 3 || this.state.password.length > 100) {
      if (name === "password")
        this.setState({ passwordError: "Password must be between 3 an 100" });
      valid = false;
    } else this.setState({ passwordError: "" });

    if (
      this.state.passwordRepeat.length < 3 ||
      this.state.passwordRepeat.length > 100
    ) {
      if (name === "passwordRepeat")
        this.setState({
          passwordRepeatError: "Password must be between 3 an 100"
        });
      valid = false;
    }

    if (this.state.passwordRepeat !== this.state.password) {
      if (name === "passwordRepeat" || name === "password")
        this.setState({ passwordRepeatError: "Passwords are not equal" });
      valid = false;
    } else this.setState({ passwordRepeatError: "" });

    if (this.state.username.length < 3 || this.state.username.length > 100) {
      if (name === "username")
        this.setState({ usernameError: "Username must be between 3 an 100" });
      valid = false;
    } else this.setState({ usernameError: "" });

    if (this.state.firstName.length < 3 || this.state.firstName.length > 100) {
      if (name === "firstName")
        this.setState({
          firstNameError: "First name must be between 3 an 100"
        });
      valid = false;
    } else this.setState({ firstNameError: "" });

    if (this.state.lastName.length < 3 || this.state.lastName.length > 100) {
      if (name === "lastName")
        this.setState({ lastNameError: "Last name must be between 3 an 100" });
      valid = false;
    } else this.setState({ lastNameError: "" });

    if (name === "email") emailError = emailErrors.join(", ");

    this.setState({
      valid: valid,
      emailError: emailError
    });
  }

  onSubmit(event) {
    AuthService.register(
      this.state.email,
      this.state.username,
      this.state.password,
      this.state.firstName,
      this.state.lastName,
      errorMessage =>
        errorMessage
          ? this.setState({ errorMessage: errorMessage, displayError: true })
          : this.props.history.push("/")
    );
    event.preventDefault();
  }

  onRegister(errorMessage) {
    if (AuthService.loggedIn()) this.props.history.push("/");
    this.setState({ errorMessage: errorMessage });
  }

  render() {
    if (AuthService.loggedIn()) return <div>Please, log out</div>;
    return (
      <div className="container">
        <div className="row">
          <div className="col z-depth-1 grey lighten-4 s12 m10 offset-m1">
            <h4 className="center-align">I see you're new here?</h4>
            <h5 className="center-align">Please, register</h5>
            <br /> <br />
            <form onSubmit={this.onSubmit}>
              <div className="row">
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={this.state.username}
                  valid={(!this.state.usernameError).toString()}
                  error={this.state.usernameError}
                  onChange={e => this.onInputChange(e, "username")}
                  required
                  minLength={3}
                  validate={true}
                  s={12}
                >
                  <Icon>perm_identity</Icon>
                </Input>
              </div>
              <div className="row">
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
                  validate={true}
                  s={12}
                >
                  <Icon>email</Icon>
                </Input>
              </div>
              
              <div className="row">
                <Input
                  label="First name"
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={this.state.firstName}
                  valid={(!this.state.firstNameError).toString()}
                  error={this.state.firstNameError}
                  onChange={e => this.onInputChange(e, "firstName")}
                  required
                  minLength={3}
                  validate={true}
                  s={12}
                  m={6}
                >
                  <Icon>perm_identity</Icon>
                </Input>
                <Input
                  label="Last name"
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={this.state.lastName}
                  valid={(!this.state.lastNameError).toString()}
                  error={this.state.lastNameError}
                  onChange={e => this.onInputChange(e, "lastName")}
                  required
                  minLength={3}
                  validate={true}
                  s={12}
                  m={6}
                >
                  <Icon>perm_identity</Icon>
                </Input>
              </div>
              <div className="row">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={this.state.password}
                  valid={(!this.state.passwordError).toString()}
                  error={this.state.passwordError}
                  onChange={e => this.onInputChange(e, "password")}
                  required
                  minLength={3}
                  validate={true}
                  s={12}
                  m={6}
                >
                  <Icon>lock_open</Icon>
                </Input>
                <Input
                  label="Repeat password"
                  type="password"
                  name="passwordRepeat"
                  placeholder="Repeat your password"
                  value={this.state.passwordRepeat}
                  valid={(!this.state.passwordRepeatError).toString()}
                  error={this.state.passwordRepeatError}
                  onChange={e => this.onInputChange(e, "passwordRepeat")}
                  required
                  minLength={3}
                  validate={true}
                  s={12}
                  m={6}
                >
                  <Icon>lock_outline</Icon>
                </Input>
              </div>
              <br />
              <div className="row">
                <Button
                  waves="green"
                  className="green lighten-2 col s10 offset-s1"
                  type="submit"
                  disabled={!this.state.valid}
                >
                  Log in
                </Button>
              </div>
              <div className="row center">
                <div className="input-field col s10 offset-s1 left-align">
                  <Link to="/login">already registered?</Link>
                </div>
              </div>
              <div className="row">
                <div className="s12">{this.renderError()}</div>
              </div>
            </form>
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
        {this.state.errorMessage}
      </div>
    );
  }
}

export default RegistrationForm;
