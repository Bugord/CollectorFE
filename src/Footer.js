import React, { Component } from "react";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { time: this.getTimeString() };
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getTimeString() {
    var d = new Date();
    d.setHours(d.getHours() + 3);
    return d
      .toISOString()
      .substr(0, 19)
      .replace("T", " ")
      .replace("-", ".")
      .replace("-", ".");
  }

  tick() {
    this.setState({ time: this.getTimeString() });
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="Footer">
        Collector - All Rights Reserved. Copyright © 2018 - {this.state.time}
      </div>
    );
  }
}

export default Footer;
