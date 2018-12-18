import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/common/header";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./components/styles/styles.css";
import "./components/styles/materializeOverride.css";
import "./components/styles/authorizationForm.css";
import Application from "./components/app/app";
import { store } from "./store";

var routes = (
  <Provider store={store}>
    <BrowserRouter>
      <main>
        <Header />
        <Route path="/" component={Application} />        
      </main>
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(routes, document.getElementById("root"));
registerServiceWorker();
