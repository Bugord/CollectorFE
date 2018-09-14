import React, { Component } from 'react';
import './components/styles/styles.css'
import AuthService from './authService'
import { Link } from "react-router-dom";
import Popup from "./popup"
import { connect } from 'react-redux'


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { showPopup: false }
        this.logout = this.logout.bind(this)

        this.state = { login: AuthService.getLogin() }
    }

    render() {
        return (
            <div className="header">
                <Link to="/"><img className="header__logo" src={require('./images/Logo.png')} alt="Collector" /></Link>

                {!AuthService.loggedIn() ?
                    <div className="header__authLinks">
                        <Link to="/login" className="button">Login</Link>
                        <Link to="/registration" className="button button--green">Registration</Link>
                    </div>
                    :
                    <div className="header__authLinks">
                        <div className="header__icon">
                            <img className="icon__img" src={require('./images/notificationIcon.png')} alt="Notifications" />
                            {this.renderNotificationCount(2)}
                        </div>
                        <div className="header__icon" onClick={() => this.setState({ showPopup: true })}><img className="icon__img" src={require('./images/profileIcon.png')} alt="Profile" /><div className="header__buttons--right">{this.props.user.username}</div></div>
                    </div>
                }
                {this.state.showPopup ? <Popup togglePopup={this.togglePopup.bind(this)} /> : null}
            </div>

        )
    }

    renderNotificationCount(count) {
        return (<div className={count === 0 ? "disabled" : "header__notificationCount"}>{count}</div>)
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    logout() {
        AuthService.logout();
    }

}

const mapStateToProps = state => {
    return {
        user: state.userApp.user,
    }
}

export default Header = connect(
    mapStateToProps
)(Header)

