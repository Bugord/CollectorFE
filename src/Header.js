import React, { Component } from 'react';
import './components/styles.css'
import AuthService from './AuthService'
import { Link } from "react-router-dom";
import Popup from "./popup"
import { connect } from 'react-redux'


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {showPopup : false}
        this.logout = this.logout.bind(this)

        this.state = { login: AuthService.getLogin()}
    }

    render() {
        return (
            <div className="header">
                        <Link to="/"><img className="headerLogo" src={require('./images/Logo.png')} alt="Collector"/></Link>
                        
                {!AuthService.loggedIn() ?
                    <div className="AuthLinks">
                        <Link to="/login" className="button">Login</Link>
                        <Link to="/registration" className="button buttonGreen">Registration</Link>
                    </div>
                    : 
                    <div className="AuthLinks">
                        <div className="headerIcon"><img src={require('./images/notificationIcon.png')}  alt="Notifications"/>{this.renderNotificationCount(2)}</div>
                        <div className="headerIcon" onClick={() => this.setState({showPopup: true})}><img src={require('./images/profileIcon.png')}  alt="Profile"/><div className="headerLogin">{this.props.user.username}</div></div>
                    </div>                    
                }
                {this.state.showPopup ? <Popup togglePopup={this.togglePopup.bind(this)}/> : null}
            </div>

        )
    }

    renderNotificationCount(count)
    {
        return(<div className={count===0 ? "disabled" : "headerNotificationCount"}>{count}</div>)
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

