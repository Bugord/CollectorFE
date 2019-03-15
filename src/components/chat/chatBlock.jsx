import React, { Component } from "react";
import { ChatMessageList } from "./chatMessageList";
import { hubConnection } from "../../hubConnection";
import { connect } from "react-redux";
import {
  chatMessageSent,
  chatMessageReceived,
  chatMessagesReceived,
  chatMessageApproved,
  chatViewed
} from "./chatActions";
import Conf from "../../configuration";
import ReactTooltip from "react-tooltip";
import Icon from "react-materialize/lib/Icon";
import { compose } from "redux";
import AuthService from "../auth/authService";
import { showError, showMessage, showWarning } from "../common/helperFunctions";
import ProgressBar from "react-materialize/lib/ProgressBar";
import md5 from "js-md5";
import { uploadFileChatAPI, getChatMessagesAPI } from "./chatService";

class ChatBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      enabled: false,
      typing: false,
      lastTypeTime: "",
      chatWith: "",
      uploadProgress: 0,
      showProgressBar: false,
      messagesLoaded: false
    };

    hubConnection.on("MessageReceived", message => {
      if (message.isPrivate) new Audio(Conf.domain + "notification.mp3").play();
      this.props.receiveMessage(message);
    });

    hubConnection.on("MessageApproved", (approved, tempId, message) => {
      if (approved) this.props.chatMessageApproved(message, tempId);
    });

    this.getChatMessages();
  }

  sendFileFromClipboard(e) {
    this.uploadFile(e.clipboardData.files[0]);
  }

  componentDidMount() {
    window.addEventListener("paste", e =>
      this.uploadFile(e.clipboardData.files[0])
    );
  }

  componentWillUnmount() {
    window.removeEventListener("paste", e =>
      this.uploadFile(e.clipboardData.files[0])
    );
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = {};
    newState[type] = value;
    this.setState(newState);
  }

  getChatMessages(chatWithUsername, offset, add = false) {
    getChatMessagesAPI(chatWithUsername, offset, 10)
      .then(res => {
        this.props.receiveMessages(res.data, add);
        this.setState({ messagesLoaded: true });
      })
      .catch(err => showError(AuthService.handleException(err)));
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

  uploadFile(file) {
    if (!file) return;

    if (file.size / 1024 > 2048) {
      showWarning("File size must be less than 2mb");
      return;
    }

    this.setState({ uploadProgress: 0, showProgressBar: true });

    uploadFileChatAPI(file, percentCompleted =>
      this.setState({ uploadProgress: percentCompleted })
    )
      .then(res =>
        this.setState(
          { text: Conf.domain + res.data, uploadProgress: 100 },
          () => {
            this.sendMessage();
            setTimeout(() => this.setState({ showProgressBar: false }), 1000);
          }
        )
      )
      .catch(res => {
        this.setState({ uploadProgress: 0, showProgressBar: false });
        showError(AuthService.handleException(res));
      });
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
          <div
            className="chatBlock__messageBlock"
            onScroll={event => {
              if (
                event.target.scrollTop === 0 &&
                this.props.messages.length >= 10 &&
                this.state.messagesLoaded
              ) {
                this.getChatMessages(
                  this.state.chatWith
                    ? this.state.chatWith.friendUser.username
                    : "",
                  this.props.messages.length,
                  true
                );
              }
            }}
          >
            <ChatMessageList messages={this.filterMessages()} />

            <input
              id="inputId"
              type="file"
              style={{ position: "fixed", top: "-100em" }}
              onChange={e => {
                this.uploadFile(e.target.files[0]);
              }}
            />
          </div>

          <div>
            {this.state.showProgressBar ? (
              <ProgressBar
                progress={this.state.uploadProgress}
                className="chatBlock__progressBar"
              />
            ) : null}
            <label
              htmlFor="inputId"
              className="chatBlock__send"
              onClick={() => {
                this.sendMessage();
              }}
            >
              <Icon small>attach_file</Icon>
            </label>
            <div className="chatBlock__inputs">
              <input
                autoComplete="off"
                type="text"
                name="message"
                className="browser-default inputOrigin"
                value={this.state.text}
                onChange={e => this.onInputChange(e, "text")}
                placeholder="Your message..."
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    this.sendMessage();
                  }
                }}
              />
            </div>
            <div
              className="chatBlock__send"
              onClick={() => {
                this.sendMessage();
              }}
            >
              <Icon small>send</Icon>
            </div>
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
                chatWith: "",
                messagesLoaded: false
              });
              this.getChatMessages();
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
                        chatWith: friend,
                        messagesLoaded: false
                      });
                      this.getChatMessages(friend.friendUser.username);
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
    let avatarUrl = User.avatarUrl;
    let text = this.state.text.trim();
    let tempId = md5(new Date().getTime().toString());
    if (text === "") return;
    if (hubConnection.Connected) {
      hubConnection.invoke(
        "SendMessage",
        text,
        this.state.chatWith ? this.state.chatWith.friendUser.username : "",
        tempId
      );
      var message = {
        username: username,
        text: text,
        isPrivate: this.state.chatWith !== "",
        sentTo: this.state.chatWith
          ? this.state.chatWith.friendUser.username
          : "",
        created: new Date(),
        avatarUrl: avatarUrl,
        tempId: tempId,
        type: "Text"
      };

      this.props.sendMessage(message);
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
    receiveMessages: (messages, add) => {
      dispatch(chatMessagesReceived(messages, add));
    },
    chatMessageApproved: (message, tempId) => {
      dispatch(chatMessageApproved(message, tempId));
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
