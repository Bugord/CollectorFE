import React, { Component } from 'react';
import './components/styles.css'
import AuthService from './AuthService'
import { Link } from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this)
    }

    render() {
        return (
            <div className="Header">
                        <Link to="/" className="HeaderLink currentHeaderLink">Home</Link>

                {!AuthService.loggedIn() ?
                    <div className="AuthLinks">
                        <Link to="/registration" className="HeaderLink">Registration</Link>
                        <Link to="/login" className="HeaderLink">Login</Link>
                    </div>
                    : 
                        <Link to="/login" className="HeaderLink LogoutButton" onClick={this.logout}>Logout</Link>
                }
            </div>

        )
    }

    logout() {
        AuthService.logout();
    }

}

export default Header;
