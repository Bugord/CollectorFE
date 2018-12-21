import React, { Component } from "react";
import { FeedbacksList } from "./feedbacksList";
import { connect } from "react-redux";
import { getAllFeedbacksAPI, addFeedbackAPI } from "./feedbacksService";
import Collection from "react-materialize/lib/Collection";
import CollectionItem from "react-materialize/lib/CollectionItem";
import Input from "react-materialize/lib/Input";
import Row from "react-materialize/lib/Row";
import Button from "react-materialize/lib/Button";
import Icon from "react-materialize/lib/Icon";
import AuthService from "../auth/authService";
import { Preloader } from "react-materialize";
import { compose } from "redux";
import PropTypes from "prop-types";

class FeedbacksListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddFeedback: false,
      subject: "",
      description: ""
    };
    getAllFeedbacksAPI();
  }

  render() {
    if (!AuthService.loggedIn()) this.props.history.push("/login");

    return (
      <div className="layout">
        <Row>
          <FeedbacksList feedbacks={this.props.feedbacks} />
        </Row>
        {this.props.feedbacksLoading ? (
          <div className="center-align">
            <Preloader size="big" color="green" />
          </div>
        ) : null}
        {!this.props.feedbacksLoading && !this.props.feedbacks.length ? (
          <h4>There are no feedbacks</h4>
        ) : null}
        {this.state.showAddFeedback ? (
          <Collection>
            <CollectionItem className="avatar">
              <Icon className="circle red small">error_outline</Icon>
              <Row>
                <Input
                  s={12}
                  label="Feedback subject"
                  type="text"
                  value={this.state.subject}
                  onChange={e => this.onInputChange(e, "subject")}
                  minLength={1}
                  maxLength={100}
                />
                <Input
                  s={12}
                  label="Feedback description"
                  type="textarea"
                  value={this.state.description}
                  onChange={e => this.onInputChange(e, "description")}
                  minLength={1}
                  maxLength={500}
                />
                <Button
                  className="col l3 green lighten-2 offset-l9 m5 offset-m7 s12"
                  onClick={() => {
                    this.addFeedback();
                    this.setState({
                      showAddFeedback: false,
                      subject: "",
                      description: ""
                    });
                  }}
                >
                  Add feedback
                </Button>
              </Row>
            </CollectionItem>
          </Collection>
        ) : (
          <Button
            className="green lighten-2"
            onClick={() => this.setState({ showAddFeedback: true })}
          >
            Add new
          </Button>
        )}
      </div>
    );
  }

  addFeedback() {
    addFeedbackAPI(this.state.subject, this.state.description);
  }

  onInputChange(event, type) {
    const value = event.target.value;
    var newState = {};
    newState[type] = value;
    this.setState(newState);
  }
}

FeedbacksListPage.propTypes = {
  feedbacks: PropTypes.array,
  feedbacksLoading: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    feedbacks: state.feedbacksApp.feedbacks,
    feedbacksLoading: state.feedbacksApp.feedbacksLoading
  };
};

export default compose(connect(mapStateToProps)(FeedbacksListPage));
