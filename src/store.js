import App from "./components/common/mainReducer";
import { createStore } from "redux";

export const store = createStore(
  App,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
