import React, { Component } from 'react';

class TextField extends Component {
  render() {
    var textFieldClass = ["textField"];
    textFieldClass.push(this.props.className);
    textFieldClass.push(!this.props.valid ? "notValidInput" : "");

    return (<div className="InputName">
      {this.props.inputName}
      <br />
      <input type={this.props.type} name={this.props.name} className={textFieldClass.join(' ')} onChange={this.props.onChange} />
      <p className="notValidInputText">{this.props.valid ? "" : this.props.errorText}</p>
    </div>
    );
  }
}

export default TextField;
