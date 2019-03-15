import React from "react";
import { FriendNotification } from "./friendNotification";
import PropTypes from "prop-types";

export const FriendNotificationList = ({
  notifications,
}) => (
  <ul className="popupList">
    {notifications.map((notification, index) => (
      <FriendNotification
        key={index}
        invite={notification}
      />
    ))}
  </ul>
);

FriendNotificationList.propTypes = {
  notifications: PropTypes.array,
};