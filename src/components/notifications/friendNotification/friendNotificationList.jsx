import React from "react";
import { FriendNotification } from "./friendNotification";
import PropTypes from "prop-types";

export const FriendNotificationList = ({
  notifications, acceptInvite, denyInvite
}) => (
    <ul className="popupList">
      {notifications.map((notification, index) => (
        <FriendNotification
          key={index}
          invite={notification}
          acceptInvite={acceptInvite}
          denyInvite={denyInvite}
        />
      ))}
    </ul>
  );

FriendNotificationList.propTypes = {
  notifications: PropTypes.array,
  acceptInvite: PropTypes.func,
  denyInvite: PropTypes.func,
};