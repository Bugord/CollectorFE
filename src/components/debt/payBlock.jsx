import React, { Component } from "react";
import Input from "react-materialize/lib/Input";
import { Icon, Row, Col } from "react-materialize";
import Button from "react-materialize/lib/Button";
import cx from "classnames";
import { PayTypeCard } from "./payTypeCard";
import { payDebtAPI } from "./debtService";
import { showMessage, showError } from "../common/helperFunctions";
import YandexMoneyForm from "../payments/yandexMoneyForm";
import TestPage from "../forTestPurpose/testPage";

export class PayBlock extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.stripeFormRef = React.createRef();

    this.state = {
      value: "",
      message: "",
      currency: 0,
      selectedCurrency: props.currencies[0],
      wasOpened: false,
      openPayTypes: false,
      selectedType: "",
      enabledTypes: [0, 3],
      payTypes: [
        {
          name: "mastercard",
          label: "mastercard",
          image: "images/mastercard.svg"
        },
        { name: "visa", label: "VISA", image: "images/VISA.svg" },
        { name: "paypal", label: "PayPal", image: "images/PayPal.svg" },
        // { name: "webmoney", label: "WebMoney", image: "images/WebMoney.svg" },
        // {
        //   name: "yandexmoney",
        //   label: "Yandex.Money",
        //   image: "images/yandexdengi.svg"
        // },
        {
          name: "message",
          label: "Send notification",
          image: "images/message.svg"
        }
      ]
    };
  }

  modalClosed() {
    this.setState({ wasOpened: false, openPayTypes: false });
  }

  onInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currencies)
      this.setState({ selectedCurrency: nextProps.currencies[0] });
  }

  render() {
    if (!this.state.selectedCurrency || !this.props.debtCurrency)
      return <div />;
    return (
      <div className="payBlock">
        <div className="payBlock__title">
          <span className="title__name">Debt paying</span>
          <br />
          <span className="title__maxValue">
            {`Max value is ${(
              (this.props.maxValue * this.state.selectedCurrency.rate) /
              this.props.debtCurrency.rate
            ).toFixed(2)} ${this.state.selectedCurrency.currencySymbol}`}
          </span>
          <br />
          <span className="title__maxValue">
            {`You will pay ${`${(
              (this.state.value * this.props.debtCurrency.rate) /
              this.state.selectedCurrency.rate
            ).toFixed(2)} ${this.props.debtCurrency.currencySymbol}`}`}
          </span>
        </div>
        <form className="payBlock__value" ref={this.formRef}>
          {this.props.isMoney && (
            <Row>
              <Col m={8} s={11}>
                <Input
                  type="number"
                  label="Value"
                  name="value"
                  step="0.01"
                  s={12}
                  value={this.state.value}
                  onChange={e => this.onInputChange(e)}
                  required
                  min={0.01}
                  max={parseFloat(
                    (
                      (this.props.maxValue * this.state.selectedCurrency.rate) /
                      this.props.debtCurrency.rate
                    ).toFixed(2)
                  )}
                >
                  <Icon>payments</Icon>
                </Input>
              </Col>
              <Col s={10} m={3} offset="s1">
                <Input
                  type="select"
                  label="Currency"
                  s={12}
                  name="currency"
                  // value={
                  //   this.props.currencies.length !== 0
                  //     ? "this.props.currencies[1].currencySymbol"
                  //     : "..."
                  // }
                  onChange={e => {
                    this.onInputChange(e);
                    this.setState({
                      selectedCurrency: this.props.currencies[e.target.value]
                    });
                  }}
                >
                  {this.props.currencies.map((value, index) => (
                    <option key={index} value={index}>
                      {value.currencySymbol}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          )}
          <Row>
            <Col s={11}>
              <Input
                type="textarea"
                label="Message"
                s={12}
                maxLength={500}
                name="message"
                value={this.state.message}
                onChange={e => this.onInputChange(e)}
              >
                <Icon>message</Icon>
              </Input>
            </Col>
          </Row>
          <Row>
            <Col offset="s1 m3" s={10} m={6}>
              <Button
                type="button"
                className="col s12 green lighten-2"
                onClick={() => {
                  let form = this.formRef.current;
                  form.reportValidity();
                  if (form.checkValidity())
                    if (this.props.isMoney)
                      this.setState({ wasOpened: true, openPayTypes: true });
                    else
                      payDebtAPI(this.props.debtId, "", this.state.message)
                        .then(() => {
                          this.props.closeModal();
                          showMessage("Debt pay was succeeded");
                        })
                        .catch(res => showError(res));
                }}
              >
                Pay
              </Button>
            </Col>
          </Row>
        </form>
        <div
          className={cx(
            "payBlock__payType",
            this.state.wasOpened
              ? this.state.openPayTypes
                ? "open"
                : "close"
              : ""
          )}
        >
          <div className="payBlock__title">
            <span className="title__name">Select a Payment Method</span>
          </div>
          <div
            className="payBlock__backArrow"
            onClick={() => this.setState({ openPayTypes: false })}
          >
            <Icon>close</Icon>
          </div>

          <div className="payTypeCards">
            {this.state.payTypes.map((type, index) => (
              <PayTypeCard
                key={index}
                name={type.name}
                label={type.label}
                image={type.image}
                disabled={!this.state.enabledTypes.includes(index)}
                className={cx(
                  "hoverable",
                  "z-depth-2",
                  index === this.state.selectedType ? "active" : ""
                )}
                onClick={() => {
                  if (this.state.enabledTypes.includes(index))
                    this.setState({ selectedType: index });
                }}
              />
            ))}
          </div>
          <div className="payBlock__total">
            {"You will pay "}
            <span>
              {this.state.value +
                " " +
                this.state.selectedCurrency.currencySymbol}
            </span>
          </div>
          <div>
            {this.state.selectedType === 0 && (
              <TestPage
                ref={this.stripeFormRef}
                value={this.state.value * 100}
                currency={this.state.currency}
              />
            )}
            {this.state.selectedType === 4 && (
              <YandexMoneyForm target="Debt paying" value={this.state.value} />
            )}
          </div>
          <div className="payBlock__payButton">
            <Row>
              <Col offset="s1 m3" s={10} m={6}>
                <Button
                  type="button"
                  className="col s12 green lighten-2"
                  onClick={() => {
                    if (
                      this.state.selectedType === 0 ||
                      this.state.selectedType === 1
                    ) {
                      if (this.stripeFormRef)
                        this.stripeFormRef.current.submit().then(res => {
                          payDebtAPI(
                            this.props.debtId,
                            this.state.value,
                            this.state.message,
                            this.state.selectedType === 3,
                            this.state.selectedCurrency.id,
                            res.id
                          )
                            .then(() => {
                              this.props.closeModal();
                              this.setState({ openPayTypes: false });
                              // showMessage("Debt pay was succeeded");
                            })
                            .catch(res => showError(res));
                        });
                    } else
                      payDebtAPI(
                        this.props.debtId,
                        this.state.value,
                        this.state.message,
                        this.state.selectedType === 3,
                        this.state.selectedCurrency.id
                      )
                        .then(() => {
                          this.props.closeModal();
                          this.setState({ openPayTypes: false });
                          // showMessage("Debt pay was succeeded");
                        })
                        .catch(res => showError(res));
                  }}
                >
                  Pay
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
