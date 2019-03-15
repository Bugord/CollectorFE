import React, { Component } from "react";
import AuthService from "./authService";
import { Link } from "react-router-dom";
import { Button, Input } from "react-materialize";
import Icon from "react-materialize/lib/Icon";
import { showError } from "../common/helperFunctions";

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.passwordRef = React.createRef();
    this.passwordRepeatRef = React.createRef();

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
      lastNameError: ""
    };
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

    var usernameError = this.state.usernameError;
    var emailError = this.state.emailError;
    var passwordError = this.state.passwordError;
    var passwordRepeatError = this.state.passwordRepeatError;
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
      case "username":
        usernameError = classNames.includes("invalid")
          ? "Invalid username"
          : "";
        break;
      case "email":
        emailError = classNames.includes("invalid") ? "Invalid email" : "";
        break;
      case "password":
        passwordError = classNames.includes("invalid")
          ? "Invalid password"
          : "";
        break;
      case "passwordRepeat":
        passwordRepeatError = classNames.includes("invalid")
          ? "Invalid password"
          : "";
        break;
      default:
        break;
    }

    this.setState({
      emailError: emailError,
      passwordError: passwordError,
      passwordRepeatError: passwordRepeatError,
      usernameError: usernameError,
      firstNameError: firstNameError,
      lastNameError: lastNameError
    });
  }

  validatePassword() {
    var password = this.passwordRef.current.input;
    var passwordRepeat = this.passwordRepeatRef.current.input;
    if (password.value !== passwordRepeat.value) {
      passwordRepeat.setCustomValidity("Passwords Don't Match");
    } else {
      passwordRepeat.setCustomValidity("");
    }
  }

  onSubmit(event) {
    AuthService.register(
      this.state.email,
      this.state.username,
      this.state.password,
      this.state.firstName,
      this.state.lastName
    )
      .then(() => this.props.history.push("/"))
      .catch(res => showError(res));

    event.preventDefault();
  }

  render() {
    if (AuthService.loggedIn()) return <div>Please, log out</div>;
    return (
      <div className="container layout">
        <div className="row">
          <div className="col z-depth-1 grey lighten-4 s12 m10 offset-m1">
            <h4 className="center-align">{"I see you're new here?"}</h4>
            <h5 className="center-align">{"Please, register"}</h5>
            <br /> <br />
            <form onSubmit={e => this.onSubmit(e)}>
              <div className="row">
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={this.state.username}
                  error={this.state.usernameError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => this.validate(e)}
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
                  error={this.state.emailError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => this.validate(e)}
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
                  error={this.state.firstNameError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => this.validate(e)}
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
                  error={this.state.lastNameError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => this.validate(e)}
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
                  ref={this.passwordRef}
                  placeholder="Enter your password"
                  value={this.state.password}
                  error={this.state.passwordError}
                  onChange={e => {
                    this.onInputChange(e);
                    this.validatePassword();
                  }}
                  onBlur={e => this.validate(e)}
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
                  ref={this.passwordRepeatRef}
                  placeholder="Repeat your password"
                  value={this.state.passwordRepeat}
                  error={this.state.passwordRepeatError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => {
                    this.validate(e);
                    this.validatePassword();
                  }}
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
                >
                  Register
                </Button>
              </div>
              <div className="row center">
                <div className="input-field col s10 offset-s1 left-align">
                  <Link to="/login">already registered?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegistrationForm;
