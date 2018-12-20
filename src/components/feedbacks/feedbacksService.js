import AuthService from "../auth/authService";
import { store } from "../../store";
import {
  getAllFeedbacks,
  getFeedbackById,
  getMessagesById,
  addMessage,
  addFeedback,
  getAllFeedbacksLoading
} from "./feedbacksActions";

export function getAllFeedbacksAPI() {
  store.dispatch(getAllFeedbacksLoading());
  return AuthService.get("api/feedback/getFeedbacks")
    .then(res => {
      store.dispatch(getAllFeedbacks(res.data));
    })
    .catch(res => {
      console.log(AuthService.handleException(res));
    });
}

export function getFeedbackAPI(id) {
  return AuthService.get("api/feedback/getFeedback", { id: id })
    .then(res => {
      store.dispatch(getFeedbackById(id, res.data));
    })
    .catch(res => {
      console.log(AuthService.handleException(res));
    });
}

export function getMessagesAPI(id) {
  return AuthService.get("api/feedback/getMessages", { id: id })
    .then(res => {
      store.dispatch(getMessagesById(id, res.data));
    })
    .catch(res => {
      console.log(AuthService.handleException(res));
    });
}

export function sendMessageAPI(feedbackId, text) {
  return AuthService.post("api/feedback/addFeedbackMessage", {
    text: text,
    feedbackId: feedbackId
  })
    .then(res => {
      store.dispatch(addMessage(feedbackId, res.data));
    })
    .catch(res => {
      console.log(AuthService.handleException(res));
    });
}

export function addFeedbackAPI(subject, description) {
  return AuthService.post("api/feedback/addFeedback", {
    subject: subject,
    description: description
  })
    .then(res => {
      store.dispatch(addFeedback(res.data));
    })
    .catch(res => {
      console.log(AuthService.handleException(res));
    });
}

export function closeFeedbackAPI(id) {
  return AuthService.put("api/feedback/close", id)
    .then(res => {
      store.dispatch(getFeedbackById(id, res.data));
    })
    .catch(res => console.log(AuthService.handleException(res)));
}
