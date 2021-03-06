import React, { Component } from "react";
import AuthService from "../auth/authService";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default class Popup extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    document.addEventListener("mousedown", e => this.handleClickOutside(e));
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", e => this.handleClickOutside(e));
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.togglePopup();
    }
  }

  render() {
    return (
      <div
        className="popup popup__navigation z-depth-2"
        ref={this.setWrapperRef}
      >
        <div className="popup__name">{AuthService.getLogin()}</div>
        <div
          type="button"
          className="popup__closeButton"
          onClick={this.props.togglePopup}
        >
          ✕
        </div>
        <ul className="popup__list">
          <li>
            <Link to="/" onClick={this.props.togglePopup}>
              Main page
            </Link>
          </li>
        </ul>
        <hr />
        <div>
          <ul className="popup__list">
            <li>
              <Link to="/profile" onClick={this.props.togglePopup}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={this.props.togglePopup}>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/friends" onClick={this.props.togglePopup}>
                Friends
              </Link>
            </li>
          </ul>
          <hr />
          <ul className="popup__list">
            <li>
              <Link to="/login" onClick={this.logout}>
                Help
              </Link>
            </li>
            <li>
              <Link to="/feedbacks" onClick={this.props.togglePopup}>
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/statistics">
                Statistics
              </Link>
            </li>
          </ul>
          <hr />
          <ul className="popup__list">
            <li>
              <Link to="/login" onClick={this.logout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  logout() {
    AuthService.logout();
    this.props.togglePopup();
  }
}

Popup.propTypes = {
  togglePopup: PropTypes.func
};
