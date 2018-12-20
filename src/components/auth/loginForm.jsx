import React, { Component } from "react";
import AuthService from "./authService";
import { Link } from "react-router-dom";
import { Button, Input } from "react-materialize";
import Icon from "react-materialize/lib/Icon";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      valid: false,
      displayError: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
    var passwordError = this.state.passwordError;

    switch (name) {
      case "email":
        emailError = classNames.includes("invalid") ? "Invalid email" : "";
        break;
      case "password":
        passwordError = classNames.includes("invalid")
          ? "Invalid password"
          : "";
        break;
      default:
        break;
    }

    this.setState({
      emailError: emailError,
      passwordError: passwordError
    });
  }

  onSubmit(event) {
    AuthService.login(this.state.email, this.state.password, errorMessage => {
      errorMessage
        ? this.setState({ errorMessage: errorMessage, displayError: true })
        : this.props.history.push("/");
    });
    event.preventDefault();
  }

  render() {
    if (AuthService.loggedIn()) return (<div> Please, log out </div>);
    return (
      <div className="container layout">
        <div className="row">
          <div className="col z-depth-1 grey lighten-4 s12 m8 offset-m2">
            <h4 className="center-align">Welcome back in Collector!</h4>
            <h5 className="center-align">Please, log in</h5>
            <br />
            <br />

            <form onSubmit={this.onSubmit}>
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
                  s={11}
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
                  error={this.state.passwordError}
                  onChange={e => this.onInputChange(e)}
                  onBlur={e => this.validate(e)}
                  required
                  minLength={3}
                  s={11}
                  validate={true}
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
                  Log in
                </Button>
              </div>

              <div className="row center">
                <div className="input-field col s5 left-align offset-s1">
                  <Link to="/registration">new here?</Link>
                </div>
                <div className="input-field col s5 right-align">
                  <Link to="/resetPassword">forgot password?</Link>
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

export default LoginForm;
