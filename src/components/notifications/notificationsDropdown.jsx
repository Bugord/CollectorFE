import React from "react";
import Popup from "../common/popup";
import { NotificationList } from "./notificationList";
import { connect } from "react-redux";
import FriendsService from "../friends/friendsService";
import AcceptFriendBlock from "./acceptFriendBlock";

class InvitesDropdown extends Popup {
  constructor(props) {
    super(props);

    this.state = { showAcceptInviteBlock: false, selectedInvite: {} };
  }

  render() {
    return (
      <div className="popup popup__notifications z-depth-2" ref={this.setWrapperRef}>
        <div className="popup__name">Notifications</div>
        <div
          type="button"
          className="popup__closeButton"
          onClick={this.props.togglePopup}
        >
          ✕
        </div>
        {this.props.invites.length !== 0 ? 
        <NotificationList
          notifications={this.props.invites}
          acceptInvite={this.openAcceptInviteBlock.bind(this)}
          denyInvite={this.denyInvite.bind(this)}
        /> : <div> You have not any notifications </div>}
        
        {this.state.showAcceptInviteBlock ? (
          <AcceptFriendBlock
            togglePopup={this.togglePopup.bind(this)}
            acceptInvite={this.acceptInvite.bind(this)}
            canAdd={true}
            hideSync={true}
          />
        ) : null}
      </div>
    );
  }

  openAcceptInviteBlock(id) {
    this.setState({ showAcceptInviteBlock: true, selectedInvite: id });
  }

  acceptInvite(friendName, friendId) {
    FriendsService.acceptFriend(
      this.state.selectedInvite,
      true,
      friendName,
      friendId
    );
    this.setState({ showAcceptInviteBlock: false });
  }

  denyInvite(id) {
    FriendsService.acceptFriend(id, false);
  }

  togglePopup() {
    this.setState({
      showAcceptInviteBlock: !this.state.showAcceptInviteBlock
    });
  }
}

const mapStateToProps = state => {
  return {
    invites: state.friendsApp.invites
  };
};

export default (InvitesDropdown = connect(mapStateToProps)(InvitesDropdown));
