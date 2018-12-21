import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import RegistrationForm from "../auth/registrationForm";
import LoginForm from "../auth/loginForm";
import friendListPage from "../friends/friendListPage";
import profilePage from "../profile/profilePage";
import { getAllFriendsAPI } from "../friends/friendsService";
import ResetPasswordPage from "../auth/resetPasswordPage";
import ConfirmEmailPage from "../auth/confirmEmailPage";
import { getAllDebtsAPI } from "../debt/debtService";
import FeedbacksListPage from "../feedbacks/feedbacksListPage";
import FeedbackPage from "../feedbacks/feedbackPage";
import { hubConnection } from "../../hubConnection";
import mainPage from "../common/mainPage";
import Header from "../common/header";

export default class Application extends Component {
  componentDidMount() {
    hubConnection.start().then(() => (hubConnection.Connected = true));
    hubConnection.onclose(() => (hubConnection.Connected = false));

    hubConnection.on("UpdateInvites", () => getAllFriendsAPI());
    hubConnection.on("UpdateDebts", () => getAllDebtsAPI());
  }

  render() {
    return (
      <BrowserRouter>
        <main>
          <Header />
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
        </main>
      </BrowserRouter>
    );
  }
}
