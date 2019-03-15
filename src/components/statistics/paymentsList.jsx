import React from "react";
import PropTypes from "prop-types";
import { Collection } from "react-materialize";
import { Payment } from "./payment";

export const PaymentsList = ({ payments, user, selectedDate }) => (
  <Collection className="popupList">
    {payments.map((payment, index) => (
      <Payment
        key={index}
        payment={payment}
        user={user}
        selectedDate={selectedDate}
      />
    ))}
  </Collection>
);

PaymentsList.propTypes = {
  payments: PropTypes.array
};
