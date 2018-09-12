import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import AuthService from './AuthService'
import { FriendsList } from './components/friendsList'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import FriendsService from './FriendsService';

class MainPage extends Component {
    constructor(props) {
        super(props);
        FriendsService.getAllFriends();
    }

    render() {
        return (
            <div className="mainPage">
                {AuthService.loggedIn() ? null : <Redirect to='/login' />}
                <div className="mainContainer">
                    <div className="debtContent"></div>
                    <div className="friendBlockContent">
                        <div className="friendsContent">
                            <FriendsList friends={this.props.friends} editable={false} />                            
                        </div>
                        <Link to="/friends" className="buttonBigGreen">Edit</Link>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        friends: state.friendsApp.friends,
    }
}

export default MainPage = connect(
    mapStateToProps
)(MainPage)
