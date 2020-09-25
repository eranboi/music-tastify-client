import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

class HomePage extends Component {
  state = {};
  renderWelcomeText = () => {
    return (
      <div className="ui ten wide middle aligned column">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Music Tastify</title>
        </Helmet>
        <div className="large-header">
          Hey there, this app is purely about
          <p>
            <span className="text-teal"> music.</span>
          </p>
        </div>

        <p>You can compare your music taste with your friends!</p>
        <p>
          Just send them your personalized link from your
          <Link to="/dashboard">
            <span className="text-teal"> dashboard </span>
          </Link>
          and start having fun with all your stats!
        </p>
      </div>
    );
  };

  render() {
    return (
      <div className="ui container">
        <div className="ui grid">
          <div className="ui six wide column">
            <img
              className="ui image"
              src="https://images.pexels.com/photos/4879684/pexels-photo-4879684.jpeg?cs=srgb&dl=pexels-matt-hardy-4879684.jpg&fm=jpg"
              alt=""
            />
          </div>
          {this.renderWelcomeText()}
        </div>
      </div>
    );
  }
}

export default HomePage;
