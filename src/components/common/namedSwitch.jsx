import React from "react";
import cx from "classnames";

export const NamedSwitch = ({
  nameOn,
  nameOff,
  checked,
  onChange,
  disabled,
  className,
  ...props
}) => {
  return (
    <div className={cx("named-switch", className)} {...props}>
      <span>{checked ? nameOn : nameOff}</span>
      <div className="switch">
        <label>
          <input
            type="checkbox"
            onChange={onChange}
            checked={checked}
            disabled={disabled}
          />
          <span className="lever" />
        </label>
      </div>
    </div>
  );
};
