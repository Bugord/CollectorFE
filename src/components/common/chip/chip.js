import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const Chip = ({ children, close, onClose, className, data, ...props }) => {
  return (
    <div className={cx("chip", className)} {...props}>
      {data.label}
      {data.value ? ": " + data.value : null}
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
  children: PropTypes.node,
  onClose: PropTypes.func,
  data: PropTypes.object.isRequired,
  /**
   * Shows a close icon
   */
  close: PropTypes.bool
};

Chip.defaultProps = {
  close: false
};

export default Chip;
