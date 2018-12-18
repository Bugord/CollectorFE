import React, { Component } from "react";
import Conf from "../../configuration";

export default class ChatMessage extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dateOfCreation = new Date().toLocaleTimeString("ru-RU", {
      hour12: false,
      hour: "numeric",
      minute: "numeric"
    });
  }

  componentDidMount() {
    this.myRef.current.scrollIntoView();
  }

  render() {
    let { message, avatarUrl } = this.props;
    console.log(avatarUrl)
    return (
      <div
        ref={this.myRef}
        className={
          message.isOwner
            ? "chatBlock__message chatBlock__message--isOwner"
            : "chatBlock__message"
        }
      >
        <div className="chatBlock__message__user">
          <span>{message.isOwner ? "You" : message.user}</span>
          <br />
          <img
            className="icon--small chatBlock__message__user__icon"
            src={avatarUrl ? Conf.domain + avatarUrl : Conf.domain + "images/defaultAvatar.png"}
            alt="profileIcon"
          />
        </div>
        <div
          className={
            message.isOwner
              ? "chatBlock__message__text chatBlock__message__text--isOwner"
              : "chatBlock__message__text chatBlock__message__text--notOwner"
          }
        >
          {message.text}
          <div className="chatBlock__message__time">{this.dateOfCreation}</div>
        </div>
      </div>
    );
  }
}
