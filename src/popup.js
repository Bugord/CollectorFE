import React, { Component } from 'react';
import AuthService from './authService'
import { Link } from "react-router-dom";

class Popup extends Component {
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.togglePopup();
        }
    }

    render() {
        return (
            <div className="popup" ref={this.setWrapperRef}>
                <div className="popup__username">{AuthService.getLogin()}</div>
                <div type="button" className="popup__closeButton" onClick={this.props.togglePopup}>✕</div>
                <hr />
                <ul className="popupList">
                 <li><Link to="/" onClick={this.props.togglePopup}>Main page</Link></li>
                </ul>
                <hr />
                <div>
                    <ul className="popupList">
                        <li><Link to="/profile">Profile</Link></li>
                        <li><a>Settings</a></li>
                        <li><Link to="/friends" onClick={this.props.togglePopup}>Friends</Link></li>
                    </ul>
                    <hr />
                    <ul className="popupList">
                        <li><a>Help</a></li>
                        <li><a>Callback</a></li>
                        <li><a>Super admin panel</a></li>
                    </ul>
                    <hr />
                    <ul className="popupList">
                       <li><Link to="/login" onClick={this.logout}>Logout</Link></li>
                    </ul>                  
                </div>
            </div>
        )
    }

    logout() {
        AuthService.logout();
        this.props.togglePopup();
    }
}


export default Popup;
