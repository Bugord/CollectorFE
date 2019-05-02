import React from "react";
import PropTypes from "prop-types";
import {
  denyPayNotificationAPI,
  acceptPayNotificationAPI
} from "../../debt/debtService";

export const PayNotification = ({ payNotification }) => (
  <li className="popupList popup__notification">
    <div>
      <span>{payNotification.payerUsername}</span>
      <span>{" notifies you, that he(she) gave you "}</span>
      {payNotification.isMoney ? (
        <span>{payNotification.value + "" + payNotification.currency}</span>
      ) : (
        <span>{`"${payNotification.debtName}"`}</span>
      )}
      <span>
        {payNotification.debtDescription
          ? " on debt (" + payNotification.debtDescription + ")"
          : " on debt with no description "}
      </span>
      <span>
        {payNotification.message
          ? " with message: " + payNotification.message
          : ""}
      </span>
    </div>
    <button
      type="button"
      onClick={() => denyPayNotificationAPI(payNotification)}
      className="button button--small invite__button"
    >
      Deny
    </button>
    <button
      type="button"
      className="button button--green button--small invite__button"
      onClick={() => acceptPayNotificationAPI(payNotification)}
    >
      Accept
    </button>
    <div className="floatClear" />
  </li>
);

PayNotification.propTypes = {
  payNotification: PropTypes.object
};
