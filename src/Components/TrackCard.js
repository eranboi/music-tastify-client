import React, { Component } from "react";

class TrackCard extends Component {
  render() {
    return (
      <div className="fifteen wide mobile seven wide tablet five wide computer column ">
        <div className="track-card">
          <div className="image">
            <img src={this.props.url} />
          </div>

          <div className="content">
            <div className="ui header">{this.props.name}</div>
            <div className="extra">
              {this.props.artists &&
                this.props.artists.map((artist, i) => {
                  if (i + 1 === this.props.artists.length) return artist.name;
                  else return artist.name + ", ";
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrackCard;
