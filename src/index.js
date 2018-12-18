import React from "react";
import ReactDOM from "react-dom";
import RegistrationForm from "./pages/registrationForm";
import Header from "./header";
import LoginForm from "./pages/loginForm";
import MainPage from "./pages/mainPage";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "./Reducers/mainReducer";
import friendListPage from "./friendListPage";
import profilePage from "./pages/profilePage";
import "./components/styles/styles.css";
import "./components/styles/materializeOverride.css";
import "./components/styles/authorizationForm.css";
import Conf from "./configuration";
import FriendsService from "./friendsService";
import ResetPasswordPage from "./resetPasswordPage";
import ConfirmEmailPage from "./confirmEmailPage";
import DebtService from "./debtService";
import FeedbacksListPage from "./components/feedbacks/feedbacksListPage";
import FeedbackPage from "./pages/feedbackPage";

const signalR = require("@aspnet/signalr");

export const store = createStore(
  App,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  var state = store.getState();
  localStorage.setItem("storage", JSON.stringify(state));
});

export const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(Conf.domain + "chat", {
    accessTokenFactory: () => localStorage.getItem("token")
  })
  .build();
hubConnection.start().then(() => (hubConnection.Connected = true));
hubConnection.onclose(() => (hubConnection.Connected = false));

hubConnection.on("UpdateInvites", () => FriendsService.getAllFriends());
hubConnection.on("UpdateDebts", () => DebtService.getAllDebts());

var routes = (
  <Provider store={store}>
    <BrowserRouter>
      <main>
        <Header />
        <Route exact path="/" component={MainPage} />
        <div className="Layout">
          <Switch>
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
        </div>
      </main>
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(routes, document.getElementById("root"));
registerServiceWorker();
