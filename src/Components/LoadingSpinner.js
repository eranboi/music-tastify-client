import React, { Component } from "react";

class LoadingSpinner extends Component {
  state = {};
  render() {
    return (
      <div className="ui active dimmer">
        <div className="ui text loader">{this.props.message}</div>
      </div>
    );
  }
}

export default LoadingSpinner;
