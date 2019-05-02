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
    <div className={cx("title", payment.isOwnerPay ? "debter" : "")}>
      <Icon>insert_invitation</Icon>
      <span className="border-bottom">{moment(payment.date).format("dddd, MMMM Do YYYY")} </span>
    </div>
    <div className={cx("title", payment.isOwnerPay ? "debter" : "")}>
      <Icon>
        {typeof payment.value === "number" ? "payments" : "business_center"}
      </Icon>
      <span>
        {payment.value
          ? payment.value +
            " " +
            (payment.currency ? payment.currency.currencySymbol : "")
          : payment.debtName}
      </span>
    </div>
  </CollectionItem>
);

Payment.propTypes = {
  payment: PropTypes.object
};
