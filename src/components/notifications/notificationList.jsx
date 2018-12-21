import React from "react";
import { Notification } from "./notification";
import PropTypes from "prop-types";

export const NotificationList = ({
  notifications,
  acceptInvite,
  denyInvite
}) => (
  <ul className="popupList">
    {notifications.map((notification, index) => (
      <Notification
        key={index}
        invite={notification}
        acceptInvite={acceptInvite}
        denyInvite={denyInvite}
      />
    ))}
  </ul>
);

NotificationList.propTypes = {
  notifications: PropTypes.array,
  acceptInvite: PropTypes.func,
  denyInvite: PropTypes.func,
};