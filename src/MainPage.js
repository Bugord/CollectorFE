import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import AuthService from './authService'
import { FriendsList } from './components/friendsList'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import FriendsService from './friendsService';
import DebtBlock from './components/debt/debtBlock';

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
                    <div className="debtContent">
                        <DebtBlock name="Верни камеру" friendName="Рита" friendDebt="+345 USD" debtPart="-782 BYR"/>
                        <DebtBlock name="xyghfk" friendName="sdge" friendDebt="-1 BYR" debtPart="+12 BYR"/>
                        <DebtBlock name="gty" friendName="asg" friendDebt="+458 USD" debtPart="-122 BYR"/>
                        <DebtBlock name="zdrsh" friendName="sdgf" friendDebt="+12 BYR" debtPart="-522 BYR"/>
                        <DebtBlock name="vfzzzzzcbf" friendName="xzzzzzzbd" friendDebt="-445 USD" debtPart="-72 BYR"/>
                        <DebtBlock isLast="true"/>
 
                    </div>
                    <div className="friendBlockContent">
                        <FriendsList friends={this.props.friends} editable={false} />
                        <br/>                                              
                        <Link to="/friends" className="button button--green">Edit</Link>
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
