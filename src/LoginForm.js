import React, { Component } from 'react';
import AuthService from './AuthService'
import TextField from './TextField'
import { Link } from "react-router-dom";


import './components/styles.css';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', emailError: '', passwordError: '', valid: false }
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

        this.setState({ valid: valid });
    }

    onSubmit(event) {
        AuthService.login(this.state.email, this.state.password,
            (errorMessage) => {
                errorMessage ? this.setState({ errorMessage: errorMessage }) : this.props.history.push('/');
            });
        event.preventDefault();
    }

    render() {
        if (AuthService.loggedIn())
            return (<div>Please, log out</div>);
        return (
            <div className="AuthFormLayout">
                <form onSubmit={this.onSubmit} className="AuthForm">
                    <h1>Login</h1>
                    <br />
                    <TextField type="text" name="email" value={this.state.email} valid={!this.state.emailError} inputName="Email" onChange={(e) => this.onInputChange(e, "email")} />
                    <TextField type="password" name="password" value={this.state.password} valid={!this.state.passwordError} inputName="Password" onChange={(e) => this.onInputChange(e, "password")} />
                    <br />
                    <br />
                    <input type="submit" value="Log in" disabled={!this.state.valid}></input>
                    <Link to="/registration" className="formLink">new here?</Link>
                    
                    {this.renderError()}
                </form>
            </div>
        );
    }



    renderError() {
        var display = this.state.emailError || this.state.passwordError || this.state.errorMessage || false;
        return (
            <div className="ErrorMessage" style={{ display: display ? "" : "none" }}>
                <p>{this.state.emailError}</p>
                <p>{this.state.passwordError}</p>
                <p>{this.state.errorMessage}</p>
            </div>
        )
    }


}

export default LoginForm;
