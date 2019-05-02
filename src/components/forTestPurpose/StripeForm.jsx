import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

class StripeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  async submit(e) {
    if (e) e.preventDefault();
    let { token } = await this.props.stripe.createToken({
      name: this.state.name
    });
    return token;
  }

  render() {
    return (
      <div className="checkout">
        <CardElement />
      </div>
    );
  }
}
export default injectStripe(StripeForm);
