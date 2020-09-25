import React, { Component } from "react";
import { Link } from "react-router-dom";

class MatchCard extends Component {
  state = {};
  render() {
    return (
      <div className="match-card">
        <div className="match-card_image">
          <img src={this.props.user.imageURL} alt="" />
        </div>
        <div className="match-card_content">
          <div className="ui header middle aligned">
            {this.props.user.username}
          </div>
          <div className="ui horizontal statistics">
            <div className="statistic">
              <div className="value">{this.props.percentage.toFixed(0)}</div>
              <div className="label">%</div>
            </div>
          </div>
          <Link to={`/match/${this.props.redirectURL}`}>
            <i className="angle huge right icon hidden-mobile"></i>
            <i className="angle big right icon mobile-only"></i>
          </Link>
        </div>
      </div>
    );
  }
}

export default MatchCard;
