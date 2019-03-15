import React from "react";
import PropTypes from "prop-types";
import { PayNotification } from "./payNotification";

export const PayNotificationList = ({
  payNotifications,
}) => (
  <ul className="popupList">
    {payNotifications.map((payNotification, index) => (
      <PayNotification
        key={index}
        payNotification={payNotification}
      />
    ))}
  </ul>
);

PayNotificationList.propTypes = {
  payNotifications: PropTypes.array,
};
