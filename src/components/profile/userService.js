import objectToFormData from "object-to-formdata";
import AuthService from "../auth/authService";

export function UpdateAvatar(file, callback) {
  const url = "api/changeProfile";
  const formData = objectToFormData({ AvatarFile: file });
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    },
    onUploadProgress: function(progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      callback(percentCompleted);
    }
  };
  return AuthService.put(url, "", formData, config);
}

export function UpdateUserInfo(firstName, lastName, email) {
  const url = "api/changeProfile";

  var userInfo = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  const formData = objectToFormData(userInfo);

  return AuthService.put(url, "", formData);
}

export function UpdatePassword(oldPassword, newPassword) {
  const url = "api/changePassword";

  return AuthService.put(url, "", {
    oldPassword,
    newPassword
  });
}
