import React from "react";
import Feedback from "./feedback";
import Collection from "react-materialize/lib/Collection";
import PropTypes from "prop-types";

export const FeedbacksList = ({
  feedbacks
}) => (
  <Collection header='Feedbacks'>
    {feedbacks.map((feedback, index) => (
      <Feedback
        key={feedback.id}       
        feedback={feedback}
        index={index}
      />
    ))}
  </Collection>
);

FeedbacksList.propTypes = {
  index: PropTypes.number,
  feedback: PropTypes.object
};