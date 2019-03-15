import objectToFormData from "object-to-formdata";
import AuthService from "../auth/authService";

export function uploadFileChatAPI(file, callback) {
  if (!file) return;

  const formData = objectToFormData({file: file});

  const url = "chat/upload";

  const config = {
    headers: {
      "content-type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      callback(percentCompleted);
    }
  };

  return AuthService.post(url, formData, config);  
}

export function getChatMessagesAPI(ChatWithUsername, offset, TakeMessages){
  return AuthService.get("chat/getMessages", {
    ChatWithUsername: ChatWithUsername,
    SkipMessages: offset,
    TakeMessages: TakeMessages
  })
}