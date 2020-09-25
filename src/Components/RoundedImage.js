import React, { Component } from "react";

class RoundedImage extends Component {
  render() {
    return (
      <img
        class={`ui rounded image ${this.props.className}`}
        src={this.props.url}
      />
    );
  }
}

export default RoundedImage;
