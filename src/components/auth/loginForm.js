import React, { Component } from "react";
import AuthService from "../auth/authService";
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
    this.validate = this.validate.bind(this);
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
    var passwordError = this.state.passwordError;
    var emailErrors = [];
    this.setState({ displayError: false });

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
        passwordError = "Password must be between 3 an 100";
      valid = false;
    } else passwordError = "";

    if (name === "email") emailError = emailErrors.join(", ");

    this.setState({
      valid: valid,
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
    if (AuthService.loggedIn()) return <div>Please, log out</div>;
    return (
      <div className="container">
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
                  valid={(!this.state.emailError).toString()}
                  error={this.state.emailError}
                  onChange={e => this.onInputChange(e, "email")}
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
                  valid={(!this.state.passwordError).toString()}
                  error={this.state.passwordError}
                  onChange={e => this.onInputChange(e, "password")}
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
                  disabled={!this.state.valid}
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
