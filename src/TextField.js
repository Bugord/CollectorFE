import React, { Component } from 'react';

class TextField extends Component {
  render() {
    return (<div className="InputName">{this.props.inputName}<br/><input style = {{borderColor: this.props.valid ? "" : "red"}} type={this.props.type} name={this.props.name} className={this.props.className} 
    onChange={this.props.onChange}/> </div>    
    );
  }
}

export default TextField;
