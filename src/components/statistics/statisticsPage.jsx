import React, { Component } from "react";
import { paymentsGetAPI } from "./statisticsService";
import { compose } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { PaymentsList } from "./paymentsList";
import cx from "classnames";
import { Icon, Col, Tabs, Input } from "react-materialize";
import { Chart } from "react-google-charts";
import { ChartButton } from "./chartButton";
import Tab from "react-materialize/lib/Tab";
import ScrollUpButton from "react-scroll-up-button";

const options = {
  hAxis: { title: "Value", viewWindow: { min: 0 } },
  vAxis: { title: "Date", viewWindow: { min: 0 } }
};

class StatisticsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: true,
      chartType: "0",
      selectedDate: "",
      dateInterval: "1",
      selectedTab: "0",
      dateStart: "",
      dateEnd: "",
      daysToIterate: 30
    };
    paymentsGetAPI();
  }

  onInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  setDateInterval(dateInterval) {
    let daysToSubtract = 0;
    switch (dateInterval) {
      case "0":
        daysToSubtract = 7;
        break;
      case "1":
        daysToSubtract = 30;
        break;
      case "2":
        daysToSubtract = 90;
        break;
      case "3":
        daysToSubtract = 365;
        break;
      default:
        daysToSubtract = 7;
    }
    this.setState({
      dateStart: moment()
        .subtract("days", daysToSubtract)
        .toDate(),
      dateEnd: new Date(),
      daysToIterate: daysToSubtract
    });
  }

  getOweData(thing = false) {
    let data = [];
    var dateMonthAgo = moment()
      .subtract("days", this.state.daysToIterate)
      .format();
    var iOwe = this.props.payments.filter(
      payment =>
        payment.isOwnerPay &&
        typeof payment.value === (thing ? "object" : "number")
    );
    var oweToMe = this.props.payments.filter(
      payment =>
        !payment.isOwnerPay &&
        typeof payment.value === (thing ? "object" : "number")
    );

    for (let i = 0; i <= this.state.daysToIterate; i++) {
      let date = moment(dateMonthAgo).add(i, "days");

      let iOweValue = iOwe
        .filter(
          payment =>
            date.format("YYYY MM DD") ===
            moment(payment.date).format("YYYY MM DD")
        )
        .reduce((value, payment) => (value += thing ? 1 : payment.value), 0);

      let oweToMeValue = oweToMe
        .filter(
          payment =>
            date.format("YYYY MM DD") ===
            moment(payment.date).format("YYYY MM DD")
        )
        .reduce((value, payment) => (value += thing ? 1 : payment.value), 0);

      data.push([date.format("YYYY MM DD"), iOweValue, oweToMeValue]);
    }

    return [["Date", "I owe", "Owe to me"], ...data];
  }

  getFriendData(thing = false) {
    var dateMonthAgo = moment()
      .subtract("days", this.state.daysToIterate)
      .toDate();

    let friends = [];

    this.props.payments.forEach(payment => {
      if (!friends.includes(payment.username)) friends.push(payment.username);
    });

    let dataForDays = this.props.payments.filter(payment =>
      new Date(payment.date) > dateMonthAgo && typeof payment.value === thing
        ? "undefined"
        : "number"
    );

    let data = [];

    for (let i = 0; i <= this.state.daysToIterate; i++) {
      let date = moment(dateMonthAgo).add(i, "days");

      let dateValue = [];
      friends.forEach(friend => {
        let value = dataForDays
          .filter(
            payment =>
              date.format("YYYY MM DD") ===
                moment(payment.date).format("YYYY MM DD") &&
              payment.username === friend
          )
          .reduce((value, payment) => (value += thing ? 1 : payment.value), 0);
        dateValue.push(value);
      });
      data.push([date.format("YYYY MM DD"), ...dateValue]);
    }

    if (!friends.length || !data.length) {
      return [["Date", "Friend"], ["0", 0]];
    }

    return [["Date", ...friends], ...data];
  }

  paymentsToData() {
    let data = [];
    switch (this.state.chartType) {
      case "0":
        data = this.getOweData();
        return data;
      case "1":
        data = this.getFriendData();
        return data;
      case "2":
        data = this.getOweData(true);
        return data;
      case "3":
        data = this.getFriendData(true);
        return data;
      default:
        return [];
    }
  }

  render() {
    return (
      <div className="row center-align layout statistics">
        <ScrollUpButton
          StopPosition={0}
          ShowAtPosition={150}
          EasingType="easeOutCubic"
          AnimationDuration={500}
          ContainerClassName="ScrollUpButton__Container"
          TransitionClassName="ScrollUpButton__Toggled"
          style={{
            zIndex: "25",
            right: "inherit",
            left: "20px",
            borderRadius: "10px"
          }}
        />
        <div className="tabs-block">
          <Tabs
            onChange={e => this.setState({ selectedTab: (e % 10).toString() })}
            defaultValue={this.state.selectedTab}
          >
            <Tab title="Payments" />
            <Tab title="Balance" />
            <Tab title="WIP" />
          </Tabs>
          <div className="date-selector">
            <Input
              type="select"
              label={`${moment(this.state.dateStart).format(
                "DD MMM YYYY"
              )} - ${moment(this.state.dateEnd).format("DD MMM YYYY")}`}
              name="dateInterval"
              value={this.state.dateInterval}
              onChange={e => {
                this.onInputChange(e);
                this.setDateInterval(e.target.value);
              }}
            >
              <optgroup label="days">
                <option value="0">Last 7 days</option>
                <option value="1">Last 30 days</option>
                <option value="2">Last 90 days</option>
                <option value="3">Last 365 days</option>
                <option value="4">All time</option>
              </optgroup>
              <optgroup label="years">
                <option value="5">{moment().format("YYYY")}</option>
                <option value="6">
                  {moment()
                    .subtract("years", 1)
                    .format("YYYY")}
                </option>
              </optgroup>
              <optgroup label="month">
                <option value="7">{moment().format("MMMM")}</option>
                <option value="8">
                  {moment()
                    .subtract("month", 1)
                    .format("MMMM")}
                </option>
                <option value="9">
                  {moment()
                    .subtract("month", 2)
                    .format("MMMM")}
                </option>
              </optgroup>
            </Input>
          </div>
        </div>
        <Col s={12}>
          <div className="chart-block">
            <div className="chart-buttons">
              <ChartButton
                title="Money"
                text="by owe"
                onClick={() => this.setState({ chartType: "0" })}
                selected={"0" === this.state.chartType}
              />
              <ChartButton
                title="Money"
                text="by friend"
                onClick={() => this.setState({ chartType: "1" })}
                selected={"1" === this.state.chartType}
              />
              <ChartButton
                title="Things"
                text="by owe"
                onClick={() => this.setState({ chartType: "2" })}
                selected={"2" === this.state.chartType}
              />
              <ChartButton
                title="Thing"
                text="by friend"
                onClick={() => this.setState({ chartType: "3" })}
                selected={"3" === this.state.chartType}
              />
            </div>
            <div className="chart">
              <Chart
                chartType="Line"
                data={this.paymentsToData()}
                options={options}
                width="calc(100% - 30px)"
                height="500px"
                legendToggle
                chartEvents={[
                  {
                    eventName: "select",
                    callback: ({ chartWrapper }) => {
                      const chart = chartWrapper.getChart();
                      const selection = chart.getSelection();
                      if (selection.length === 1) {
                        const [selectedItem] = selection;
                        const { row } = selectedItem;
                        this.setState({
                          selectedDate: moment()
                            .subtract("days", this.state.daysToIterate - row)
                            .format("YYYY MM DD")
                        });
                      }
                    }
                  }
                ]}
              />
            </div>
          </div>
        </Col>
        <Col s={12}>
          <div className={cx("payments", this.state.closed ? "closed" : "")}>
            <PaymentsList
              payments={this.props.payments}
              user={this.props.user}
              selectedDate={this.state.selectedDate}
            />
          </div>
          <div
            className="button-more clickable"
            onClick={() => this.setState({ closed: !this.state.closed })}
          >
            <Icon>{this.state.closed ? "expand_more" : "expand_less"}</Icon>
          </div>
        </Col>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    payments: state.statisticsApp.payments,
    user: state.userApp.user
  };
};

export default compose(connect(mapStateToProps)(StatisticsPage));
