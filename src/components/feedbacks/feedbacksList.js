import React from "react";
import Feedback from "./feedback";
import Collection from "react-materialize/lib/Collection";

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
