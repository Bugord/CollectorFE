import React, { Component } from "react";
import AuthService from "./authService";

class ConfirmEmailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        errorMessage: "",
      };
      if(props.match.params.token || false)
        AuthService.put("api/confirmEmail",props.match.params.token)
        .then(res => this.props.history.push("/login"))
        .catch(res => {
          this.setState({
            errorMessage: AuthService.handleException(res)
          });
        });
       // 
  }

  renderError() {
    var display = this.state.errorMessage || false;
    return (
      <div className="errorMessage" style={{ display: display ? "" : "none" }}>
        <p>{this.state.errorMessage}</p>
      </div>
    );
  }

  render() {
    return (
      <div >
        {this.renderError()}
      </div>
    );
  }
}

export default ConfirmEmailPage;
