import React from "react"
import ReactDOMServer from "react-dom/server";
import Conf from "../../configuration";

const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\v=|&v=|\?v=)([^#&?]*).*/;
const coubRegExp = /^.*(coub.com\/|v\/|u\/\w\/|embed\/|view\/)([^#&?]*).*/;
const ImageRegExp = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

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

export function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(s);
}

export function isImageUrl(url) {
  var match = url.match(ImageRegExp);
  if (match) return true;
  else return false;
}

export function isYoutubeUrl(url) {
  var match = url.match(youtubeRegExp);
  if (match && match[2].length === 11) return true;
  else return false;
}

export function isCoubUrl(url) {
  var match = url.match(coubRegExp);
  if (match && match[2].length > 3) return true;
  else return false;
}

export function getYoutubeEmbed(url) {
  return url.match(youtubeRegExp)[2];
}

export function getCoubEmbed(url) {
  return url.match(coubRegExp)[2];
}

export function testImage(url, timeout = 5000) {
  return new Promise(function(resolve, reject) {
    var timer,
      img = new Image();
    img.onerror = img.onabort = function() {
      clearTimeout(timer);
      reject("error");
    };
    img.onload = function() {
      clearTimeout(timer);
      resolve("success");
    };
    timer = setTimeout(function() {
      img.src = "//!!!!/test.jpg";
      reject("timeout");
    }, timeout);
    img.src = url;
  });
}

export function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function tooltip(user) {
  if (!user) return "";
  return ReactDOMServer.renderToStaticMarkup(
    <div
      className="tooltip"
      onMouseEnter={() => {
        this.setState({ onTipHovered: true });
      }}
      onMouseLeave={() => {
        this.setState({ onTipHovered: false });
      }}
    >
      <div className="icon__img">
        <img src={Conf.domain + user.avatarUrl} alt="FeedbackCreatorAvatar" />
      </div>
      <div>
        <p>
          {user.username}
          {user.userRole !== "User" ? `(${user.userRole})` : null}
        </p>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
