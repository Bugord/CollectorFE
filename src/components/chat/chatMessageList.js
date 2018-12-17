import ChatMessage from "./chatMessage";
import React from 'react'

export const ChatMessageList = ({messages}) => (
  <ul>
    {messages.map((message, id) => (
      <ChatMessage key={id} message={message}/>
    ))}
  </ul>
);
