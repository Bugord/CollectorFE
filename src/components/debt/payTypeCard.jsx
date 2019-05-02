import React from "react";
import cx from "classnames";
import Conf from "../../configuration";

export const PayTypeCard = ({ className, name, image, label, disabled, ...props }) => {
  return (
    <div
      className={cx("payTypeCard", className, disabled ? "disabled" : "")}
      {...props}
    >
      <img src={Conf.domain + image} alt={name} />
      <span>{label}</span>
    </div>
  );
};
