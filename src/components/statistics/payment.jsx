import React from "react";
import PropTypes from "prop-types";
import CollectionItem from "react-materialize/lib/CollectionItem";
import moment from "moment";
import { Icon } from "react-materialize";
import Conf from "../../configuration";
import cx from "classnames";

export const Payment = ({ payment, user, selectedDate }) => (
  <CollectionItem
    className={cx(
      "payment",
      selectedDate === moment(payment.date).format("YYYY MM DD")
        ? "selected"
        : ""
    )}
  >
    <div className="payment__avatars">
      <img
        className="circle friend__icon z-depth-1"
        title={payment.isOwnerPay ? user.username : payment.username}
        src={
          Conf.domain +
          (payment.isOwnerPay ? user.avatarUrl : payment.avatarUrl)
        }
        alt="Profile"
      />
      <div className={payment.isOwnerPay ? "debter" : ""}>
        <Icon>arrow_forward</Icon>
      </div>
      <img
        className="circle friend__icon z-depth-1"
        title={payment.isOwnerPay ? payment.username : user.username}
        src={
          Conf.domain +
          (payment.isOwnerPay ? payment.avatarUrl : user.avatarUrl)
        }
        alt="Profile"
      />
    </div>
    <div>{moment(payment.date).format("dddd, MMMM Do YYYY")}</div>
    <div>
      {payment.value ? payment.value + payment.currency : payment.debtName}
    </div>
    <div>{payment.isOwnerPay ? "Yes" : "No"}</div>
  </CollectionItem>
);

Payment.propTypes = {
  payment: PropTypes.object
};
