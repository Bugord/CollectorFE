import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import Application from "./components/app/app";
import { store } from "./store";
import "./coreStyle.css";

var routes = (
  <Provider store={store}>
    <Application />
  </Provider>
);
ReactDOM.render(routes, document.getElementById("root"));
registerServiceWorker();
