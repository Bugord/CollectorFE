import React, { Component } from 'react';
import AuthService from './AuthService'
import TextField from './TextField'
import { Link } from "react-router-dom";

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
        <div className="Layout">
            <div className="form">
                <div className="AuthFormLayout">
                    <form onSubmit={this.onSubmit} className="authForm">
                        <h1>Welcome back in Collector!</h1>
                        <br />
                        <h2>Please, log in</h2>

                        <TextField type="text" name="email" value={this.state.email} valid={!this.state.emailError} inputName="Email" errorText={this.state.emailError} onChange={(e) => this.onInputChange(e, "email")} />
                        <TextField type="password" name="password" value={this.state.password} valid={!this.state.passwordError} inputName="Password" errorText={this.state.passwordError} onChange={(e) => this.onInputChange(e, "password")} />
                        <br />
                        <input type="submit" value="Log in" disabled={!this.state.valid} className="buttonBigGreen"></input>
                        <Link to="/registration" className="formLink">new here?</Link>
                        <br />
                        <br />
                        {this.renderError()}
                    </form>
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
        )
    }


}

export default LoginForm;
