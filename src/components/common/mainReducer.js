import { combineReducers } from "redux";
import { friendsApp } from "../friends/friendsReducers";
import { userApp } from "../profile/userReducers";
import { debtsApp } from "../debt/debtsReducers";
import { chatApp } from "../chat/chatReducers";
import { feedbacksApp } from "../feedbacks/feedbacksReducers";

const App = combineReducers({
  friendsApp,
  userApp,
  debtsApp,
  chatApp,
  feedbacksApp
});

export default App;
