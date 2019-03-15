import ChatMessage from "./chatMessage";
import React from "react";

export const ChatMessageList = ({ messages }) => (
  <div>
    {messages.map((message, id) => (
      <ChatMessage key={message.created} message={message} />
    ))}
  </div>
);
