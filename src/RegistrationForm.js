import React, { Component } from 'react';
import AuthService from './AuthService'
import TextField from './TextField'
import { Link } from "react-router-dom";

import './components/styles.css';

class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            firstName: '',
            lastName: '',
            emailError: '',
            passwordError: '',
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
                    if(name==="email")
                        this.setState({ emailError: "Your email is not valid" });
                    valid = false;
                }
                else this.setState({ emailError: "" });

                if (this.state.password.length < 3 || this.state.password.length > 20) {
                    if(name==="password")
                        this.setState({ passwordError: "Password must be between 3 an 20" });
                    valid = false;
                }
                else this.setState({ passwordError: "" });

                if (this.state.username.length < 3 || this.state.username.length > 16) {
                    if(name==="username")
                        this.setState({ usernameError: "Username must be between 3 an 16" });
                    valid = false;
                }
                else this.setState({ usernameError: "" });

                if (this.state.firstName.length < 3 || this.state.firstName.length > 16) {
                    if(name==="firstName")
                        this.setState({ firstNameError: "First name must be between 3 an 16" });
                    valid = false;
                }
                else this.setState({ firstNameError: "" });

                if (this.state.lastName.length < 3 || this.state.lastName.length > 16) {
                    if(name==="lastName")
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
            <div className="AuthFormLayout">
                <form onSubmit={this.onSubmit} className="AuthForm">
                    <h1>Registration</h1>
                    <br />
                    <TextField type="email" name="email" value={this.state.email} valid={!this.state.emailError} inputName="Email" onChange={(e) => this.onInputChange(e, "email")} />
                    <TextField type="text" name="username" value={this.state.username} valid={!this.state.usernameError} inputName="Username" onChange={(e) => this.onInputChange(e, "username")} />
                    <TextField type="password" name="password" value={this.state.password} valid={!this.state.passwordError} inputName="Password" onChange={(e) => this.onInputChange(e, "password")} />
                    <TextField type="text" name="firstName" value={this.state.firstName} valid={!this.state.firstNameError} inputName="First name" onChange={(e) => this.onInputChange(e, "firstName")} />
                    <TextField type="text" name="lastName" value={this.state.lastName} valid={!this.state.lastNameError} inputName="Last name" onChange={(e) => this.onInputChange(e, "lastName")} />
                    <br />
                    <br />
                    <input type="submit" value="Register" disabled={!this.state.valid}></input>
                    <Link to="/login" className="formLink">already registered?</Link>
                    {this.renderError()}
                </form>
            </div>

        )
    }

    renderError() {
        var display = this.state.emailError || this.state.passwordError || this.state.errorMessage ||
         this.state.firstNameError || this.state.lastNameError || this.state.usernameError || false;

        return (
            <div className="ErrorMessage" style={{display : display? "" : "none"}}>
                <p>{this.state.emailError}</p>
                <p>{this.state.passwordError}</p>
                <p>{this.state.usernameError}</p>
                <p>{this.state.firstNameError}</p>
                <p>{this.state.lastNameError}</p>
                <p>{this.state.errorMessage}</p>
            </div>
        )
    }
}

export default RegistrationForm;
