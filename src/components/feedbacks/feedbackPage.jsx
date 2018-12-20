import React, { Component } from "react";
import { connect } from "react-redux";
import { getFeedbackAPI, getMessagesAPI, sendMessageAPI } from "./feedbacksService";
import { FeedbackMessagesList } from "./feedbackMessagesList";
import Feedback from "./feedback";
import Collection from "react-materialize/lib/Collection";
import CollectionItem from "react-materialize/lib/CollectionItem";
import Conf from "../../configuration";
import Input from "react-materialize/lib/Input";
import Row from "react-materialize/lib/Row";
import Button from "react-materialize/lib/Button";
import AuthService from "../auth/authService";

class FeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.feedbackId = parseInt(this.props.match.params.id, 10);
    let feedback = props.feedbacks.find(
      feedback => feedback.id === this.feedbackId
    );
    if (!feedback) getFeedbackAPI(this.feedbackId);
    getMessagesAPI(this.feedbackId);
    this.state = {
      feedback: feedback,
      feedbacks: props.feedbacks,
      message: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.feedbacks)
      this.setState({
        feedback: nextProps.feedbacks.find(
          feedback => feedback.id === this.feedbackId
        )
      });
  }

  render() {
    if (!AuthService.loggedIn()) this.props.history.push("/login");

    let { feedback } = this.state;
    if (!feedback) return null;
    return (
      <div className="layout">
        <Collection header="Feedback">
          <Feedback feedback={feedback} full={true} user={this.props.user} />
        </Collection>
        <br />
        <br />
        <FeedbackMessagesList feedbackMessages={this.props.messages} />
        <br />

        <Collection>
          <CollectionItem className="avatar">
            <img
              src={Conf.domain + this.props.user.avatarUrl}
              alt="FeedbackCreatorAvatar"
              className="circle"
            />
            <Row>
              <Input
                s={12}
                label="Message text"
                type="text"
                value={this.state.message}
                onChange={e => this.onInputChange(e, "message")}
                minLength={1}
                maxLength={500}
              />
              <Button
                className="col l3 green lighten-2 offset-l9 m5 offset-m7 s12"
                disabled={
                  this.state.message.length < 1 ||
                  this.state.message.length > 500
                }
                onClick={() => {
                  this.sendMessage();
                  this.setState({ message: "" });
                }}
              >
                Send message
              </Button>
            </Row>
          </CollectionItem>
        </Collection>
      </div>
    );
  }

  sendMessage() {
    sendMessageAPI(this.state.feedback.id, this.state.message);
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = {};
    newState[type] = value;
    this.setState(newState);
  }
}

const mapStateToProps = state => {
  return {
    feedbacks: state.feedbacksApp.feedbacks,
    messages: state.feedbacksApp.messages,
    user: state.userApp.user
  };
};

export default (FeedbackPage = connect(mapStateToProps)(FeedbackPage));
