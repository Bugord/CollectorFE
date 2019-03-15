import React from "react";
import PropTypes from "prop-types";
import { confirmNotificationAPI } from "../notificationService";

export const Notification = ({ notification }) => (
  <li className="popupList popup__notification">
    <div>
      <span>{notification.message}</span>
    </div>
    <button
      type="button"
      className="button button--green button--small invite__button"
      onClick={() => confirmNotificationAPI(notification.id)}
    >
      Confirm
    </button>
    <div className="floatClear" />
  </li>
);

Notification.propTypes = {
  payNotification: PropTypes.object
};
