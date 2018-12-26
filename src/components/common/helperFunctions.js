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

export function showError(error) {
  window.Materialize.toast(error, 3000, "red lighten-2");
}

export function showMessage(message) {
  window.Materialize.toast(message, 3000, "green lighten-2");
}
