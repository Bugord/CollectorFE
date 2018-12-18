import React, { Component } from "react";
import { Card, Input } from "react-materialize";

export default class SettingsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
        firstName: "",
        lastName: "",
    };
  }

  render() {
    return (
        <Card className="left-align row">
          <Input
            s={6}
            label="First name"
            type="text"
            value={this.state.firstName}
            onChange={e => this.onInputChange(e, "firstName")}
            minLength={1}
            maxLength={100}
          />
          <Input
            s={6}
            label="Last name"
            type="text"
            value={this.state.lastName}
            onChange={e => this.onInputChange(e, "lastName")}
            minLength={1}
            maxLength={100}
          />
          <Input s={12} value={this.state.email} />
        </Card>
    );
  }
}
