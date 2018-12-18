import React from "react";
import Collection from "react-materialize/lib/Collection";
import FeedbackMessage from "./feedbackMessage";

export const FeedbackMessagesList = ({ feedbackMessages }) => (
  <Collection className="no-border" header={"Messages"}>
    {feedbackMessages.map((feedbackMessage, index) => (
      <FeedbackMessage
        key={feedbackMessage.id}
        feedbackMessage={feedbackMessage}
        index={index}
      />
    ))}
  </Collection>
);
