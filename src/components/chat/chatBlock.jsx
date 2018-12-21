import React, { Component } from "react";
import { ChatMessageList } from "./chatMessageList";
import { hubConnection } from "../../hubConnection";
import { connect } from "react-redux";
import {
  chatMessageSent,
  chatMessageReceived,
  chatStartTyping,
  chatStopTyping,
  chatViewed
} from "./chatActions";
import Conf from "../../configuration";
import ReactTooltip from "react-tooltip";
import Icon from "react-materialize/lib/Icon";
import { compose } from "redux";

class ChatBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      enabled: false,
      typing: false,
      lastTypeTime: "",
      chatWith: ""
    };
    hubConnection.on("MessageReceived", message => {
      this.props.receiveMessage(message);
    });
    hubConnection.on("StartTyping", username => {
      this.props.startTyping(username);
    });
    hubConnection.on("StopTyping", username => {
      this.props.stopTyping(username);
    });
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = {};
    newState[type] = value;
    this.startTyping();
    this.setState(newState);
  }

  stopTyping(forced) {
    if (!this.state.typing) return;
    let elapsedTime = Date.now() - this.state.lastTypeTime;
    if (elapsedTime >= 1000 || forced) {
      this.setState({ typing: false });
      hubConnection.invoke("StopTyping");
    } else {
      setTimeout(() => this.stopTyping(), 1000);
    }
  }

  startTyping() {
    if (this.state.chatWith !== "") return;
    this.setState({ lastTypeTime: Date.now() });
    if (!this.state.typing) {
      this.setState({ typing: true });
      hubConnection.invoke("StartTyping");
      setTimeout(() => this.stopTyping(), 1000);
    }
  }

  render() {
    return this.state.enabled ? this.renderEnabled() : this.renderDisabled();
  }

  renderDisabled() {
    return (
      <div
        className={
          this.props.newMessages ? "chatBlock__icon pulse" : "chatBlock__icon"
        }
        onClick={() => {
          this.setState({ enabled: true });
          this.props.chatViewed();
        }}
      >
        <img
          className=" icon--small"
          src={require("../../images/chatIcon.png")}
          alt="FriendIcon"
        />
      </div>
    );
  }

  getTypingText() {
    let { typing } = this.props;
    if (!typing.length) return "";
    if (typing.length === 1) return typing[0].user + " is typing...";
    if (typing.length === 2)
      return typing[0].user + " and " + typing[1].user + " are typing...";
    return (
      typing[0].user +
      ", " +
      typing[1].user +
      " and " +
      (typing.length - 2) +
      " more people are typing..."
    );
  }

  filterMessages() {
    return this.state.chatWith
      ? this.props.messages.filter(
          message =>
            message.isPrivate &&
            (message.username === this.state.chatWith.friendUser.username ||
              message.sentTo === this.state.chatWith.friendUser.username)
        )
      : this.props.messages.filter(message => !message.isPrivate);
  }

  renderEnabled() {
    return (
      <div className="chatBlock z-depth-2">
        <div className="chat__window">
          <div className="chat__header">
            <div>
              {this.state.chatWith
                ? "Chat with " + this.state.chatWith.friendUser.username
                : "Global chat"}
              <div
                className="popup__closeButton"
                onClick={() => {
                  this.setState({ enabled: false });
                  this.props.chatViewed();
                }}
              >
                <Icon>close</Icon>
              </div>
            </div>
          </div>

          <div className="chatBlock__messageBlock">
            <ChatMessageList messages={this.filterMessages()} />
          </div>
          <div className="chatBlock__typingMessage">{this.getTypingText()}</div>
          <div className="chatBlock__inputs">
            <input
              type="text"
              name="message"
              className="browser-default inputOrigin"
              value={this.state.text}
              onChange={e => this.onInputChange(e, "text")}
              placeholder="Your message..."
              onKeyPress={e => {
                if (e.key === "Enter") {
                  this.stopTyping(true);
                  this.sendMessage();
                }
              }}
            />
          </div>
          <div
            className="chatBlock__send"
            onClick={() => {
              this.stopTyping(true);
              this.sendMessage();
            }}
          >
            <Icon small>send</Icon>
          </div>
        </div>
        <div className="chatBlock__friends z-depth-2">
          <ReactTooltip place="left" effect="solid" />

          <img
            data-tip="Global chat"
            className={
              this.state.chatWith === ""
                ? "friend__icon z-depth-2 active"
                : "friend__icon z-depth-2"
            }
            src={Conf.domain + "images/globalChat.png"}
            onClick={() => {
              this.setState({
                chatWith: ""
              });
            }}
            alt="Global chat"
          />
          {this.props.friends.map((friend, index) => {
            if (friend.friendUser)
              return (
                <div key={friend.id}>
                  <img
                    data-tip={friend.friendUser.username}
                    key={index}
                    className={
                      this.state.chatWith === friend
                        ? "friend__icon z-depth-1 active"
                        : "friend__icon z-depth-1"
                    }
                    onClick={() => {
                      this.setState({
                        chatWith: friend
                      });
                    }}
                    src={Conf.domain + friend.friendUser.avatarUrl}
                    alt={friend.friendUser.username}
                  />
                </div>
              );
            else return null;
          })}
        </div>
      </div>
    );
  }

  sendMessage() {
    let { User } = this.props;
    let username = User.username;
    let text = this.state.text.trim();
    if (text === "") return;
    if (hubConnection.Connected) {
      hubConnection.invoke(
        "SendMessage",
        text,
        this.state.chatWith ? this.state.chatWith.friendUser.username : ""
      );
      this.props.sendMessage({
        username: username,
        text: text,
        isPrivate: this.state.chatWith !== "",
        sentTo: this.state.chatWith
          ? this.state.chatWith.friendUser.username
          : ""
      });
      this.setState({ text: "" });
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendMessage: message => {
      dispatch(chatMessageSent(message));
    },
    receiveMessage: message => {
      dispatch(chatMessageReceived(message));
    },
    startTyping: user => {
      dispatch(chatStartTyping(user));
    },
    stopTyping: user => {
      dispatch(chatStopTyping(user));
    },
    chatViewed: () => {
      dispatch(chatViewed());
    }
  };
};

const mapStateToProps = state => {
  return {
    User: state.userApp.user,
    friends: state.friendsApp.friends,
    messages: state.chatApp.messages,
    newMessages: state.chatApp.newMessages,
    typing: state.chatApp.typing
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChatBlock)
);
