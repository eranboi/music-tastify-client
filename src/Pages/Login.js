import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";

import { signInUser } from "../actions";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Helmet } from "react-helmet";
import config from "../config";

class Login extends Component {
  state = { cookie: "" };

  componentDidMount = async () => {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const login_state = params.get("login_state");
    const token = params.get("token");

    console.log("TOKEN:", token);
    console.log("PARAMS:", params);

    if (login_state == "success") {
      try {
        Cookies.set("SESSION_MUSIC_TASTIFY", JSON.stringify({ token: token }));

        const response = await axios.get(`${config.baseURL}users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.props.signInUser(response.data);

        if (isMobile && response) {
          const redirect_to = params.get("redirect_to");
          this.props.history.push(redirect_to);
        }
        if (!isMobile && response) {
          window.opener.postMessage(
            JSON.stringify({ user: response.data, token }),
            process.env.NODE_ENV == "development"
              ? "http://localhost:3000"
              : "https://www.music-tastify.com"
          );

          window.close();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  render = () => {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Login | Music Tastify</title>
        </Helmet>
        <LoadingSpinner message="Talking To Spotify!" />
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { signInUser })(Login);
