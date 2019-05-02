import React, { Component } from "react";
import { Elements } from "react-stripe-elements";
import StripeForm from "./StripeForm";
import { StripeProvider } from "react-stripe-elements";

export default class TestPage extends Component {
  constructor(props) {
    super(props);
    this.stripeFormRef = React.createRef();
  }

  submit() {
    return this.child.submit();
  }

  render() {
    return (
      <StripeProvider apiKey="pk_test_t0xkwmHifM7YtO66yA4hnO3h">
        <Elements>
          <StripeForm
            // ref={this.stripeFormRef}
            onRef={ref => (this.child = ref)} 
            value={this.props.value}
            currency={this.props.currency}
          />
        </Elements>
      </StripeProvider>
    );
  }
}
