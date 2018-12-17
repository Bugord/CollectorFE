import { combineReducers } from "redux";
import { friendsApp } from "./friendsReducers";
import { userApp } from "./userReducers";
import { debtsApp } from "./debtsReducers";
import { chatApp } from "./chatReducers";
import { feedbacksApp } from "./feedbacksReducers";

const App = combineReducers({
  friendsApp,
  userApp,
  debtsApp,
  chatApp,
  feedbacksApp
});

export default App;
