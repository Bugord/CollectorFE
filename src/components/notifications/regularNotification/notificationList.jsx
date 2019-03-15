import React from "react";
import PropTypes from "prop-types";
import { Notification } from "./notification";

export const NotificationList = ({ notifications }) => (
  <ul className="popupList">
    {notifications.map(notification => (
      <Notification key={Notification.id} notification={notification} />
    ))}
  </ul>
);

NotificationList.propTypes = {
  notifications: PropTypes.array
};
