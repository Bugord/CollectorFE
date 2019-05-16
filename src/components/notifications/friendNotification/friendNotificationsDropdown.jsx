import React, { Fragment } from "react";
import Popup from "../../common/popup";
import { FriendNotificationList } from "./friendNotificationList";
import { connect } from "react-redux";
import { acceptFriendAPI } from "../../friends/friendsService";
import AcceptFriendBlock from "../acceptFriendBlock";
import { compose } from "redux";
import PropTypes from "prop-types";
import { PayNotificationList } from "../payNotification/payNotificationList";
import { NotificationList } from "../regularNotification/notificationList";

class InvitesDropdown extends Popup {
  constructor(props) {
    super(props);

    this.state = { showAcceptInviteBlock: false, selectedInvite: {} };
  }

  render() {
    return (
      <div
        className="popup popup__notifications z-depth-2"
        ref={this.setWrapperRef}
      >
        <div className="popup__name">Notifications</div>
        <div
          type="button"
          className="popup__closeButton"
          onClick={this.props.togglePopup}
        >
          ✕
        </div>
        {!this.props.invites.length &&
        !this.props.payNotifications.length &&
        !this.props.notifications.length ? (
          <div> You have not any notifications </div>
        ) : (
          <Fragment>
            <FriendNotificationList
              notifications={this.props.invites}
              acceptInvite={id => this.openAcceptInviteBlock(id)}
              denyInvite={id => this.denyInvite(id)}
            />
            <PayNotificationList
              payNotifications={this.props.payNotifications}
            />
            <NotificationList notifications={this.props.notifications} />
          </Fragment>
        )}

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
    debugger
    this.setState({ showAcceptInviteBlock: true, selectedInvite: id });
  }

  acceptInvite(friendName, friendId) {
  debugger
    acceptFriendAPI(this.state.selectedInvite, true, friendName, friendId);
    this.setState({ showAcceptInviteBlock: false });
  }

  denyInvite(id) {
    debugger
    acceptFriendAPI(id, false);
  }

  togglePopup() {
    this.setState({
      showAcceptInviteBlock: !this.state.showAcceptInviteBlock
    });
  }
}

InvitesDropdown.propTypes = {
  invites: PropTypes.array,
  togglePopup: PropTypes.func
};

const mapStateToProps = state => {
  return {
    invites: state.friendsApp.invites,
    payNotifications: state.debtsApp.payNotifications,
    notifications: state.notificationsApp.notifications
  };
};

export default compose(connect(mapStateToProps)(InvitesDropdown));
