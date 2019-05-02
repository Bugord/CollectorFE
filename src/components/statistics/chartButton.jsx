import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

export const ChartButton = ({ title, text, selected, onClick }) => (
  <div
    className={cx("chart-button", selected ? "selected" : "")}
    onClick={onClick}
  >
    <div className="title">{title}</div>
    <div className="text">{text}</div>
  </div>
);

ChartButton.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string
};
