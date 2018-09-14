import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import AuthService from './authService'
import { connect } from 'react-redux'

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = { login: AuthService.getLogin(), friends :[], valid: false}

        this.authorizedRender = this.authorizedRender.bind(this);
      
        if (!this.state.login && AuthService.loggedIn()) {
            AuthService.getInfo((login) => this.setState({ login: login }));
        }
    }

    render() {
        return (
            <div className="MainPage">
                {AuthService.loggedIn() ? this.authorizedRender() : <Redirect to='/login' />}
            </div>
        )
    }


    authorizedRender() {
        return (
            <div>
                <h2>Welcome, {this.props.user.username}</h2>
            </div>

            
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.userApp.user,
    }
}

export default ProfilePage = connect(
    mapStateToProps
)(ProfilePage)

