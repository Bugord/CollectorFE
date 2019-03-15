import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const Chip = ({ close, onClose, className, data, ...props }) => {
  return (
    <div className={cx("chip", className)} {...props}>
      {data.type === "bool"
        ? data.value
          ? data.nameOn
          : data.nameOff
        : `${data.label}: ${data.value}`}

      {/* {data.label}
      {data.value ? ": " + data.value : null} */}
      {close ? (
        <i className="close-icon material-icons" onClick={() => onClose()}>
          close
        </i>
      ) : null}
    </div>
  );
};

Chip.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  data: PropTypes.object.isRequired,
  close: PropTypes.bool
};

Chip.defaultProps = {
  close: false
};

export default Chip;
