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