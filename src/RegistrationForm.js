import React, { Component } from 'react';
import AuthService from './AuthService'
import TextField from './TextField'
import { Link } from "react-router-dom";

class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordRepeat: '',
            username: '',
            firstName: '',
            lastName: '',
            emailError: '',
            passwordError: '',
            passwordRepeatError: '',
            usernameError: '',
            firstNameError: '',
            lastNameError: ''
        }
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

        this.setState({ errorMessage: "" });

        if (!this.validateEmail(this.state.email)) {
            if (name === "email")
                this.setState({ emailError: "Your email is not valid" });
            valid = false;
        }
        else this.setState({ emailError: "" });

        if (this.state.password.length < 3 || this.state.password.length > 20) {
            if (name === "password")
                this.setState({ passwordError: "Password must be between 3 an 20" });
            valid = false;
        }
        else this.setState({ passwordError: "" });

        if (this.state.passwordRepeat.length < 3 || this.state.passwordRepeat.length > 20) {
            if (name === "passwordRepeat")
                this.setState({ passwordRepeatError: "Password must be between 3 an 20" });
            valid = false;
        }

        if (this.state.passwordRepeat != this.state.password) {
            if (name === "passwordRepeat" || name === "password")
                this.setState({ passwordRepeatError: "Passwords are not equal" });
            valid = false;
        }
        else this.setState({ passwordRepeatError: "" });

        if (this.state.username.length < 3 || this.state.username.length > 16) {
            if (name === "username")
                this.setState({ usernameError: "Username must be between 3 an 16" });
            valid = false;
        }
        else this.setState({ usernameError: "" });

        if (this.state.firstName.length < 3 || this.state.firstName.length > 16) {
            if (name === "firstName")
                this.setState({ firstNameError: "First name must be between 3 an 16" });
            valid = false;
        }
        else this.setState({ firstNameError: "" });

        if (this.state.lastName.length < 3 || this.state.lastName.length > 16) {
            if (name === "lastName")
                this.setState({ lastNameError: "Last name must be between 3 an 16" });
            valid = false;
        }
        else this.setState({ lastNameError: "" });


        this.setState({ valid: valid });
    }

    onSubmit(event) {
        AuthService.register(this.state.email, this.state.username, this.state.password,
            this.state.firstName, this.state.lastName,
            (errorMessage) =>
                errorMessage ? this.setState({ errorMessage: errorMessage }) : this.props.history.push('/'));
        event.preventDefault();
    }

    onRegister(errorMessage) {
        if (AuthService.loggedIn())
            this.props.history.push('/');
        this.setState({ errorMessage: errorMessage });
    }

    render() {
        if (AuthService.loggedIn())
            return (<div>Please, log out</div>);
        return (
            <div className="Layout">
                <div className="form">
                    <div className="AuthFormLayout">
                        <form onSubmit={this.onSubmit} className="authForm">
                            <h1>I see you're new here?</h1>
                            <br />
                            <h2>Please, register</h2>
                            <TextField type="email" name="email" value={this.state.email} valid={!this.state.emailError} inputName="Email" errorText={this.state.emailError} onChange={(e) => this.onInputChange(e, "email")} />
                            <TextField type="text" name="username" value={this.state.username} valid={!this.state.usernameError} inputName="Username" errorText={this.state.usernameError} onChange={(e) => this.onInputChange(e, "username")} />
                            <TextField type="password" name="password" value={this.state.password} valid={!this.state.passwordError} inputName="Password" errorText={this.state.passwordError} onChange={(e) => this.onInputChange(e, "password")} />
                            <TextField type="password" name="passwordRepeat" value={this.state.passwordRepeat} valid={!this.state.passwordRepeatError} inputName="Repeat password" errorText={this.state.passwordRepeatError} onChange={(e) => this.onInputChange(e, "passwordRepeat")} />
                            <TextField type="text" name="firstName" value={this.state.firstName} valid={!this.state.firstNameError} inputName="First name" errorText={this.state.firstNameError} onChange={(e) => this.onInputChange(e, "firstName")} />
                            <TextField type="text" name="lastName" value={this.state.lastName} valid={!this.state.lastNameError} inputName="Last name" errorText={this.state.lastNameError} onChange={(e) => this.onInputChange(e, "lastName")} />
                            <br />
                            <input type="submit" value="Register" disabled={!this.state.valid} className="buttonBigGreen"></input>
                            <Link to="/login" className="formLink">already registered?</Link>
                            <br />
                            <br />
                            {this.renderError()}
                        </form>
                    </div>
                </div>
            </div>

        )
    }

    renderError() {
        var display = this.state.errorMessage || false;

        return (
            <div className="errorMessage" style={{ display: display ? "" : "none" }}>
                <p>{this.state.errorMessage}</p>
            </div>
        )
    }
}

export default RegistrationForm;
