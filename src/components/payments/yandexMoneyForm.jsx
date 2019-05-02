import React, { Component } from "react";

export default class YandexMoneyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: ""
    };
  }

  onInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  render() {
    return (
      <iframe
        src={`https://money.yandex.ru/quickpay/shop-widget?writer=seller
        &targets=${this.props.target}&targets-hint=&default-sum=${this.props.value}&button-text=12
        &payment-type-choice=on&hint=&successURL=&quickpay=shop&account=410013533730238`}
        width="423"
        height="222"
        frameBorder="0"
        title="yandex"
        scrolling="no"
      />
    );
  }
}
