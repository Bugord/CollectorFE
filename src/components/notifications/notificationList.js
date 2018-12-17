import React from "react";
import { Notification } from "./notification";

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
