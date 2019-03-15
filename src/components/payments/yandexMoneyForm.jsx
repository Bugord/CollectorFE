import React, { Component } from "react";
import { Input } from "react-materialize";
import Button from "react-materialize";

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

  onSubmit(e) {
    console.log("submited!");
    return false;
  }

  render() {
    return (
      <iframe
        src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=trrtt&targets-hint=&default-sum=&button-text=12&payment-type-choice=on&hint=&successURL=&quickpay=shop&account=410013533730238"
        width="423"
        height="222"
        frameBorder="0"
        // allowTransparency="true"
        scrolling="no"
      />
      // <form
      //   onSubmit={e => this.onSubmit(e)}
      //   className="yandexMoney__form"
      //   action="https://money.yandex.ru/quickpay/confirm.xml"
      //   method="POST"
      // >
      //   <Input
      //     name="receiver"
      //     value={this.state.receiver}
      //     onChange={e => this.onInputChange(e)}
      //   />
      //   <Input name="quickpay-form" value="donate" />
      //   <Input name="targets" value="donate" />
      //   <Input name="paymentType" value="AC" />
      //   <Input name="sum" value="10" />
      //   <input type="submit" value="Submit" />
      // </form>
    );
  }
}
