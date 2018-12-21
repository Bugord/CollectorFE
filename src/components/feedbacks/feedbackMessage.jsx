import React, { Component } from "react";
import Conf from "../../configuration";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { CollectionItem } from "react-materialize";
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')


export default class FeedbackMessage extends Component {
  tooltip(user) {
    return ReactDOMServer.renderToStaticMarkup(
      <div className="tooltip">
        <div className="icon__img">
          <img src={Conf.domain + user.avatarUrl} alt="FeedbackCreatorAvatar" />
        </div>
        <div>
          <p>
            {user.username}
            {user.userRole !== "User" ? `(${user.userRole})` : null}
          </p>
          <p>{user.email}</p>
        </div>
      </div>
    );
  }

  render() {
    let { feedbackMessage } = this.props;
    let createdLocalTime = new Date(new Date(feedbackMessage.created).getTime() - (new Date()).getTimezoneOffset() * 60000)

    return (
      <CollectionItem className="avatar feedback-message-text margin-bottom">
        <img
          src={Conf.domain + feedbackMessage.user.avatarUrl}
          alt="FeedbackCreatorAvatar"
          className="circle"
        />
        <div className="title min-height">{feedbackMessage.text}</div>
        <ReactTooltip place="top" effect="solid" html/>
        <p>
          <span className="date">{`#${this.props.index + 1} posted ${timeAgo.format(
            createdLocalTime
          )} by `}</span>
          <span data-tip={this.tooltip(feedbackMessage.user)}>{`${
            feedbackMessage.user.username
          }`}</span>
        </p>
      </CollectionItem>
    );
  }
}

FeedbackMessage.propTypes = {
  feedbackMessage: PropTypes.object,
  index: PropTypes.number
};