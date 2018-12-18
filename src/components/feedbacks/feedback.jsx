import React, { Component } from "react";
import Conf from "../../configuration";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { CollectionItem } from "react-materialize";
import Icon from "react-materialize/lib/Icon";
import Link from "react-router-dom/Link";
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import FeedbacksService from "./feedbacksService";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default class Feedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onTipHovered: false
    };
  }

  tooltip(user) {
    if (!user) return "";
    return ReactDOMServer.renderToStaticMarkup(
      <div
        className="tooltip"
        onMouseEnter={() => {
          this.setState({ onTipHovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ onTipHovered: false });
        }}
      >
        <div className="icon__img">
          <img src={Conf.domain + user.avatarUrl} alt="FeedbackCreatorAvatar" />
        </div>
        <div>
          <p>
            {user.username}{" "}
            {user.userRole !== "User" ? `(${user.userRole})` : null}
          </p>
          <p>{user.email}</p>
        </div>
      </div>
    );
  }

  closeFeedback() {
    FeedbacksService.closeFeedback(this.props.feedback.id);
  }

  render() {
    let { feedback } = this.props;
    let createdLocalTime = new Date(
      new Date(feedback.created).getTime() -
        new Date().getTimezoneOffset() * 60000
    );
    let closedLocalTime = feedback.isClosed
      ? new Date(
          new Date(feedback.created).getTime() -
            new Date().getTimezoneOffset() * 60000
        )
      : "";

    return (
      <CollectionItem
        className={
          feedback.messagesCount
            ? "avatar no-min-height with-padding-right"
            : "avatar no-min-height "
        }
      >
        {/* <img
          src={Conf.domain + feedback.creator.avatarUrl}
          alt="FeedbackCreatorAvatar"
          className="circle"
        /> */}
        <Icon
          className={
            feedback.isClosed ? "circle green small" : "circle red small"
          }
        >
          {feedback.isClosed ? "done" : "error_outline"}
        </Icon>
        <Link className="title" to={"/feedbacks/" + feedback.id}>
          {feedback.subject}
        </Link>
        {!this.props.full ? (
          <ReactTooltip
            place="right"
            effect="solid"
            html
            delayHide={this.state.onTipHovered ? 300000 : 300}
          />
        ) : null}

        {this.props.full ? <p>{feedback.description}</p> : null}
        <p>
          {feedback.isClosed ? (
            <span className="date">
              {`#${feedback.id} by `}
              <span data-tip={this.tooltip(feedback.creator)}>
                {feedback.creator.username}
              </span>{" "}
              {`
              closed ${timeAgo.format(closedLocalTime)} by `}{" "}
              <span data-tip={this.tooltip(feedback.closedBy)}>
                {feedback.creator.username}
              </span>
            </span>
          ) : (
            <span className="date">
              {`#${feedback.id} opened ${timeAgo.format(createdLocalTime)} by `}{" "}
              <span data-tip={this.tooltip(feedback.creator)}>{`${
                feedback.creator.username
              }`}</span>
            </span>
          )}
        </p>

        <div className="secondary-content">
          {feedback.messagesCount && !this.props.full? (
            <Link to={"/feedbacks/" + feedback.id}>
              {feedback.messagesCount}
              <Icon>chat_bubble_outline</Icon>
            </Link>
          ) : null}
          {this.props.full && !feedback.isClosed ? (
            <span onClick={() => this.closeFeedback()}>
              <Icon>check_circle</Icon> Close
            </span>
          ) : null}
        </div>
      </CollectionItem>
    );
  }
}
