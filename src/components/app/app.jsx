import React, { Component } from "react";
import RegistrationForm from "../auth/registrationForm";
import LoginForm from "../auth/loginForm";
import { Route, Switch } from "react-router-dom";
import friendListPage from "../friends/friendListPage";
import profilePage from "../profile/profilePage";
import FriendsService from "../friends/friendsService";
import ResetPasswordPage from "../auth/resetPasswordPage";
import ConfirmEmailPage from "../auth/confirmEmailPage";
import DebtService from "../debt/debtService";
import FeedbacksListPage from "../feedbacks/feedbacksListPage";
import FeedbackPage from "../feedbacks/feedbackPage";
import { hubConnection } from "../../hubConnection";
import mainPage from "../common/mainPage";

export default class Application extends Component {
  componentDidMount() {
    hubConnection.start().then(() => (hubConnection.Connected = true));
    hubConnection.onclose(() => (hubConnection.Connected = false));

    hubConnection.on("UpdateInvites", () => FriendsService.getAllFriends());
    hubConnection.on("UpdateDebts", () => DebtService.getAllDebts());
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={mainPage} />
        <Route path="/registration" component={RegistrationForm} />
        <Route path="/friends" component={friendListPage} />
        <Route path="/login" component={LoginForm} />
        <Route path="/resetPassword/:token" component={ResetPasswordPage} />
        <Route path="/confirmEmail/:token" component={ConfirmEmailPage} />
        <Route path="/resetPassword" component={ResetPasswordPage} />
        <Route path="/profile" component={profilePage} />
        <Route exact path="/feedbacks" component={FeedbacksListPage} />
        <Route path="/feedbacks/:id" component={FeedbackPage} />
      </Switch>
    );
  }
}
