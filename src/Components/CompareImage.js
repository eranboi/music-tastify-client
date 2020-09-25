import React, { Component } from "react";

class CompareImage extends Component {
  render() {
    return (
      <img
        class={`ui circular image ${this.props.className}`}
        src={this.props.url}
      />
    );
  }
}

export default CompareImage;
