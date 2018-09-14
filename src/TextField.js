import React, { Component } from 'react';

class TextField extends Component {
  render() {
    var textFieldClass = ["textField", "input"];
    textFieldClass.push(this.props.className);
    textFieldClass.push(!this.props.valid ? "input--redBorder" : "");

    return (
    <div className="input__name">
      {this.props.inputName}
      <br />
      <input type={this.props.type} name={this.props.name} className={textFieldClass.join(' ')} onChange={this.props.onChange} />
      <p className="input__errorText">{this.props.valid ? "" : this.props.errorText}</p>
    </div>
    );
  }
}

export default TextField;
