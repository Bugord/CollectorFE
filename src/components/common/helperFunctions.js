export function convertUTCDateToLocalDate(date) {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}

export function convertLocalDateToUTCDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}
