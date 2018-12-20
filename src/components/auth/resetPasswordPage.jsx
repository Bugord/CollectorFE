import React, { Component } from "react";
import AuthService from "./authService";
import { Redirect } from "react-router-dom";
import { Button, Input, Row, Col, Icon } from "react-materialize";

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.withToken = props.match.params.token || false;

    this.passwordRef = React.createRef();
    this.passwordRepeatRef = React.createRef();

    this.state = {
      password: "",
      passwordRepeat: "",
      passwordRepeatError: "",
      passwordError: "",
      email: "",
      emailError: "",
      mailSent: false,
      valid: false
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

  validatePassword() {
    var password = this.passwordRef.current.input;
    var passwordRepeat = this.passwordRepeatRef.current.input;
    if (password.value !== passwordRepeat.value) {
      passwordRepeat.setCustomValidity("Passwords Don't Match");
    } else {
      passwordRepeat.setCustomValidity("");
    }
  }

  validate(event) {
    var classNames = event.target.className;
    var name = event.target.name;

    var emailError = this.state.emailError;
    var passwordError = this.state.passwordError;
    var passwordRepeatError = this.state.passwordRepeatError;

    switch (name) {
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
      passwordRepeatError: passwordRepeatError
    });
  }

  renderEmailSent() {
    return <h4>Mail was sent, please check your email</h4>;
  }

  render() {
    return (
      <div className="container layout">
        <div className="row">
          <div className="col z-depth-1 grey lighten-4 s12 m8 offset-m2">
            {this.state.mailSent
              ? this.renderEmailSent()
              : this.withToken
              ? this.renderWithToken()
              : this.renderWithoutToken()}
            <br />
            {this.renderError()}
          </div>
        </div>
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

  onPasswordEmailSend(event) {
    if (!AuthService.loggedIn())
      AuthService.put("api/resetPassword", this.state.email)
        .then(() => this.setState({ mailSent: true }))
        .catch(res => {
          this.setState({
            errorMessage: AuthService.handleException(res)
          });
        });
    event.preventDefault();
  }

  onPasswordChange(event) {
    if (!AuthService.loggedIn())
      AuthService.put("api/resetPassword", "", {
        token: this.props.match.params.token,
        password: this.state.password
      })
        .then(() => this.props.history.push("/login"))
        .catch(res => {
          this.setState({
            errorMessage: AuthService.handleException(res)
          });
        });
    event.preventDefault();
  }

  renderWithoutToken() {
    return (
      <form onSubmit={e => this.onPasswordEmailSend(e)}>
        <h4 className="center-align">Reset password</h4>
        <h5 className="center-align">
          Enter email to send reset password link
        </h5>
        <br />
        <br />
        <Row>
          <Input
            s={11}
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
            maxLength={100}
            validate={true}
          >
            <Icon>drafts</Icon>
          </Input>
        </Row>
        <Row>
          <Button type="submit" className="green lighten-2 col s6 offset-s3">
            Send email
          </Button>
        </Row>
      </form>
    );
  }

  renderWithToken() {
    if (AuthService.loggedIn()) return <Redirect to="/" />;
    return (
      <form onSubmit={e => this.onPasswordChange(e)}>
        <h4 className="center-align">Reset password</h4>
        <h5 className="center-align">Enter new password</h5>
        <br />
        <Row>
          <Input
            s={11}
            type="password"
            name="password"
            value={this.state.password}
            ref={this.passwordRef}
            validate={true}
            label="New password"
            error={this.state.passwordError}
            minLength={3}
            maxLength={100}
            onChange={e => {
              this.onInputChange(e);
              this.validatePassword();
            }}
            onBlur={e => this.validate(e)}
            required
          >
            <Icon>lock_outline</Icon>
          </Input>
          <Input
            s={11}
            type="password"
            name="passwordRepeat"
            value={this.state.passwordRepeat}
            ref={this.passwordRepeatRef}
            validate={true}
            label="Confirm new password"
            error={this.state.passwordRepeatError}
            minLength={3}
            maxLength={100}
            onChange={e => this.onInputChange(e)}
            onBlur={e => {
              this.validate(e);
              this.validatePassword();
            }}
            required
          >
            <Icon>lock_outline</Icon>
          </Input>
        </Row>
        <Col s={8} offset="s3">
          <Row>
            <Button type="submit" s={12} className="green lighten-2">
              Change password
            </Button>
          </Row>
        </Col>
      </form>
    );
  }
}

export default ResetPasswordPage;
