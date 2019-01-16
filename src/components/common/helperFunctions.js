export function convertUTCDateToLocalDate(date) {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}

export function convertLocalDateToUTCDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}

export function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

export function showError(error, time = 3000) {
  window.Materialize.toast(error, time, "red lighten-2");
}

export function showMessage(message, time = 3000) {
  window.Materialize.toast(message, 3000, "green lighten-2");
}

export function showWarning(message, time = 3000) {
  window.Materialize.toast(message, 3000, "orange lighten-2");
}

