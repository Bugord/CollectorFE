import React, { Component } from "react";
import AuthService from "../auth/authService";
import { Link } from "react-router-dom";
import Popup from "./popup";
import { connect } from "react-redux";
import NotificationsDropdown from "../notifications/notificationsDropdown";
import Conf from "../../configuration";
import { compose } from "redux";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false, showNotificationsDropdown: false };
    this.state = { login: AuthService.getLogin() };
  }

  render() {
    return (
      <div className="header">
        <Link to="/">
          <img
            className="header__logo"
            src={require("../../images/Logo.png")}
            alt="Collector"
          />
        </Link>

        {!AuthService.loggedIn() ? (
          <div className="header__authLinks">
            <Link to="/login" className="button button--green">
              Login
            </Link>
            <Link to="/registration" className="button">
              Registration
            </Link>
          </div>
        ) : (
          <div className="header__authLinks">
            <div className="header__icon">
              <div className="icon__img">
                <img
                  onMouseDown={() =>
                    this.setState({ showNotificationsDropdown: true })
                  }
                  src={require("../../images/notificationIcon.png")}
                  alt="Notifications"
                />
              </div>
              {this.renderNotificationCount(this.props.invites.length)}
            </div>
            <div
              className="header__icon"
              onMouseDown={() => this.setState({ showPopup: true })}
            >
              <div className="icon__img">
                <img
                  src={Conf.domain + this.props.user.avatarUrl}
                  alt="Profile"
                />
              </div>
              <div className="header__buttons--right">
                {this.props.user.username}
              </div>
            </div>
          </div>
        )}
        {this.state.showPopup ? (
          <Popup togglePopup={this.togglePopup.bind(this)} />
        ) : null}
        {this.state.showNotificationsDropdown ? (
          <NotificationsDropdown
            togglePopup={this.toggleNotificationsDropdown.bind(this)}
          />
        ) : null}
      </div>
    );
  }

  renderNotificationCount(count) {
    return (
      <div className={count === 0 ? "hidden" : "header__notificationCount"}>
        {count}
      </div>
    );
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  toggleNotificationsDropdown() {
    this.setState({
      showNotificationsDropdown: !this.state.showNotificationsDropdown
    });
  }
}

const mapStateToProps = state => {
  return {
    user: state.userApp.user,
    invites: state.friendsApp.invites
  };
};

export default compose(connect(mapStateToProps)(Header));
