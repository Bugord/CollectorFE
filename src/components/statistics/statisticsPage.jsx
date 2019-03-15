import React, { Component } from "react";
import { paymentsGetAPI } from "./statisticsService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from "recharts";
import { compose } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { PaymentsList } from "./paymentsList";
import cx from "classnames";
import Icon from "react-materialize/lib/Icon";
import { Chart } from "react-google-charts";
const options = {
  title: "Age vs. Weight comparison",
  hAxis: { title: "Value", viewWindow: { min: 0 } },
  vAxis: { title: "Date", viewWindow: { min: 0 } },
  gantt: {
    palette: [
      {
        color: "#cccccc",
        dark: "#333333",
        light: "#eeeeee"
      }
    ]
  },
  legend: "none"
};

class StatisticsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { closed: true, chartType: 1, selectedDate: "" };
    paymentsGetAPI();
  }

  getOweData() {
    let data = [];
    var dateMounthAgo = moment()
      .subtract("days", 30)
      .format();
    var iOwe = this.props.payments.filter(
      payment => payment.isOwnerPay && typeof payment.value === "number"
    );
    var oweToMe = this.props.payments.filter(
      payment => !payment.isOwnerPay && typeof payment.value === "number"
    );

    for (let i = 0; i < 30; i++) {
      let date = moment(dateMounthAgo).add(i, "days");

      let iOweValue = iOwe
        .filter(
          payment =>
            date.format("YYYY MM DD") ===
            moment(payment.date).format("YYYY MM DD")
        )
        .reduce((value, payment) => (value += payment.value), 0);

      let oweToMeValue = oweToMe
        .filter(
          payment =>
            date.format("YYYY MM DD") ===
            moment(payment.date).format("YYYY MM DD")
        )
        .reduce((value, payment) => (value += payment.value), 0);

      data.push([date.format("YYYY MM DD"), iOweValue, oweToMeValue]);
    }

    return [["Date", "I owe", "Owe to me"], ...data];
  }

  getFriendData() {
    var dateMounthAgo = moment()
      .subtract("days", 30)
      .toDate();

    let friends = [];

    this.props.payments.forEach(payment => {
      if (!friends.includes(payment.username)) friends.push(payment.username);
    });

    let dataForDays = this.props.payments.filter(
      payment =>
        new Date(payment.date) > dateMounthAgo &&
        typeof payment.value === "number"
    );

    let data = [];

    for (let i = 0; i < 30; i++) {
      let date = moment(dateMounthAgo).add(i, "days");

      let dateValue = [];
      friends.forEach(friend => {
        let value = dataForDays
          .filter(
            payment =>
              date.format("YYYY MM DD") ===
                moment(payment.date).format("YYYY MM DD") &&
              payment.username === friend
          )
          .reduce((value, payment) => (value += payment.value), 0);
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
      case 0:
        data = this.getOweData();
        return data;
      case 1:
        data = this.getFriendData();
        return data;
      default:
        return [];
    }
  }

  render() {
    return (
      <div className="row center-align layout statistics">
        <Chart
          chartType="Line"
          data={this.paymentsToData()}
          options={options}
          width="100%"
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
                  const dataTable = chartWrapper.getDataTable();
                  const { row, column } = selectedItem;
                  this.setState({
                    selectedDate: moment()
                      .subtract("days", 30 - row)
                      .format("YYYY MM DD")
                  });
                }
              }
            }
          ]}
        />
        {/* <LineChart
          className="chart"
          width={890}
          height={500}
          data={this.paymentsToData()}
          margin={{
            top: 20,
            right: 50,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="iOwe" stroke="#d15959" />
          <Line type="monotone" dataKey="oweToMe" stroke="#8eca88" />
        </LineChart> */}
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
