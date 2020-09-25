import React, { Component, Children } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ReactGA from "react-ga";
import config from "../config";

import { signOut } from "../actions";
import { isMobile } from "react-device-detect";
import Axios from "axios";

const GA_tracking_id = "UA-162115241-2";

ReactGA.initialize(GA_tracking_id);

class Navbar extends Component {
  state = { currentURL: "" };

  componentDidMount() {}

  renderLoggedIn = () => {
    return (
      <nav style={{ marginTop: "0px!important" }}>
        <div className="nav-brand">
          <Link to="/">Music-Tastify!</Link>
        </div>
        <div className="nav-right">
          <ul>
            <li>
              <Link
                to="/dashboard"
                onClick={() => {
                  ReactGA.event({
                    category: "Navigation Bar",
                    action: "User clicked to the dashboard on navbar.",
                  });
                }}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.signOut();
                  ReactGA.event({
                    category: "Sign Out",
                    action: "User clicked sign out button.",
                  });
                }}
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  renderNotLoggedIn = () => {
    return (
      <nav style={{ marginTop: "0px!important" }}>
        <div className="nav-brand">
          <Link to="/">Music-Tastify!</Link>
        </div>
        <div className="nav-right">
          <ul>
            <li>
              <div
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();

                  let location = window.location.href;
                  let redirect = "";

                  if (isMobile) {
                    console.log(config.baseURL);
                    redirect = location.split("/#");
                    ReactGA.event({
                      category: "Redirect Mobile",
                      action: `Redirected to ${redirect[1]}`,
                    });
                  }

                  this.props.loginUser(redirect[1]);
                }}
              >
                Sign in
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  render() {
    return (
      <>
        {this.props.auth.isSignedIn && this.renderLoggedIn()}
        {!this.props.auth.isSignedIn && this.renderNotLoggedIn()}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { signOut })(Navbar);
