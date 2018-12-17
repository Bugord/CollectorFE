import React, { Component } from "react";

class TextField extends Component {
  render() {
    var textFieldClass = ["textField", "input"];
    textFieldClass.push(this.props.className);
    textFieldClass.push(!this.props.valid ? "input--redBorder" : "");

    return (
      <div >
        {this.props.inputName}
        <input
          placeholder={this.props.placeholder}
          type={this.props.type}
          name={this.props.name}
          min={this.props.min}
          className={textFieldClass.join(" ")}
          onChange={this.props.onChange}
          value={this.props.value}
        />
        <p className="input__errorText">
          {this.props.valid ? "" : this.props.errorText}
        </p>
      </div>
    );
  }
}

export default TextField;
