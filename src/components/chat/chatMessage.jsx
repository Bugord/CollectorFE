import React, { Component } from "react";
import Conf from "../../configuration";
import PropTypes from "prop-types";
import { getYoutubeEmbed, getCoubEmbed } from "../common/helperFunctions";
import Icon from "react-materialize/lib/Icon";
import { Modal } from "react-materialize";
import AudioPlayer from "react-h5-audio-player";

export default class ChatMessage extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dateOfCreation = new Date(props.message.created).toLocaleTimeString(
      "ru-RU",
      {
        hour12: false,
        hour: "numeric",
        minute: "numeric"
      }
    );
  }

  componentDidMount() {
    this.myRef.current.scrollIntoView();
  }

  getMessageBody(message) {
    switch (message.type) {
      case "Image":
        return <img src={message.text} alt={message.text} />;
      case "Audio":
        return <AudioPlayer src={message.text} />;
      case "YoutubeVideo":
        return (
          <iframe
            src={
              "https://www.youtube.com/embed/" +
              getYoutubeEmbed(message.text) +
              "?enablejsapi=1&version=3&playerapiid=ytplayer&nofrm=1"
            }
            title={getYoutubeEmbed(message.text)}
            id={message.id}
            frameBorder="0"
            allowFullScreen
            scrolling="yes"
          />
        );
      case "Coub":
        return (
          <iframe
            src={
              "https://coub.com/embed/" +
              getCoubEmbed(message.text) +
              "?nofrm=1"
            }
            title={getCoubEmbed(message.text)}
            id={message.id}
            allowFullScreen="true"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        );
      case "Url":
        return (
          <a href={message.text} target="_blank" rel="noopener noreferrer">
            {message.text}
          </a>
        );
      case "Text":
      default:
        return <div>{message.text}</div>;
    }
  }

  isMediaMessage(type) {
    switch (type) {
      case "YoutubeVideo":
      case "Coub":
      case "Image":
        return true;
      default:
        return false;
    }
  }

  render() {
    let { message } = this.props;
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
          <span className="chatBlock__message__user__username">
            {message.isOwner ? "You" : message.username}
          </span>
          <br />
          <img
            className="icon--small chatBlock__message__user__icon friend__icon z-depth-1"
            src={
              message.avatarUrl
                ? Conf.domain + message.avatarUrl
                : Conf.domain + "images/defaultAvatar.png"
            }
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
          {this.getMessageBody(message)}
          <div className="chatBlock__message__time">{this.dateOfCreation}</div>
          {this.isMediaMessage(message.type) ? (
            <Modal
              trigger={
                <div className="chatBlock__message__open">
                  <Icon tiny>zoom_out_map</Icon>
                </div>
              }
              id={"modal" + message.id}
              className="chatMessage__Modal"
              modalOptions={{
                complete: function() {
                  var modal = document.getElementById("modal" + message.id);
                  var iframe = modal.getElementsByTagName("iframe")[0];
                  if (iframe) {
                    iframe.contentWindow.postMessage("stop", "*");
                    iframe.contentWindow.postMessage(
                      '{"event":"command","func":"stopVideo","args":""}',
                      "*"
                    );
                  }
                }
              }}
            >
              {this.getMessageBody(message)}
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

ChatMessage.propTypes = {
  message: PropTypes.object,
  avatarUrl: PropTypes.string
};
