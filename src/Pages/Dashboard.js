import React, { Component } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TwitterIcon,
  WhatsappIcon,
  FacebookIcon,
} from "react-share";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";
import { isMobile } from "react-device-detect";

import RoundedImage from "../Components/RoundedImage";
import MatchCard from "../Components/MatchCard";
import LoadingSpinner from "../Components/LoadingSpinner";
import Match from "./Match";
import config from "../config";

const GA_tracking_id = "UA-162115241-2";

ReactGA.initialize(GA_tracking_id);

class Dashboard extends Component {
  state = { processing: false, matches: [], compareURL: "" };

  componentDidMount = async () => {
    try {
      const userToken = JSON.parse(Cookies.get("SESSION_MUSIC_TASTIFY"));

      const response = await axios.get(`${config.baseURL}users/me/matches`, {
        headers: {
          Authorization: `Bearer ${userToken.token}`,
        },
      });

      console.log(response.data);
      this.setState({
        matches: response.data,
        compareURL: encodeURIComponent(this.props.auth.user.username),
      });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.auth.isSignedIn && this.state.processing) {
      this.setState({ processing: false });
    }
  };

  copyToClipboard = (e, input) => {
    input.select();
    document.execCommand("copy");

    ReactGA.event({
      category: "Link Copied",
      action: "Link Copied",
    });

    // This is just personal preference.
    // I prefer to not show the whole text area selected.
  };

  renderSocialButtons = () => {
    return (
      <div className="socials mt-2 mb-5">
        <TwitterShareButton
          url={`https://www.music-tastify.com/#/compare/${this.state.compareURL}`}
          title={"Compare your music taste with me!"}
          className="socials_button"
          onClick={() => {
            ReactGA.event({
              category: "Social Share",
              action: "Twitter Share",
            });
          }}
        >
          <TwitterIcon size={36} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton
          url={`https://www.music-tastify.com/#/compare/${this.state.compareURL}`}
          title={" Compare your music taste with me!"}
          separator=" music-tastify "
          className="socials_button"
          onClick={() => {
            ReactGA.event({
              category: "Social Share",
              action: "Whatsapp Share",
            });
          }}
        >
          <WhatsappIcon size={36} round={true} />
        </WhatsappShareButton>

        <FacebookShareButton
          url={`https://www.music-tastify.com/#/compare/${this.state.compareURL}`}
          quote={" Compare your music taste with me! "}
          hashtag=" music-tastify "
          className="socials_button"
          onClick={() => {
            ReactGA.event({
              category: "Social Share",
              action: "Facebook Share",
            });
          }}
        >
          <FacebookIcon size={36} round={true} />
        </FacebookShareButton>
      </div>
    );
  };

  renderMatches = () => {
    return this.state.matches.map((match) => {
      return (
        <MatchCard
          user={match.userInfo}
          percentage={match.match}
          redirectURL={match.id}
        />
      );
    });
  };

  renderLoggedIn = () => {
    return (
      <div className="ui fluid container mt-5">
        <div className="ui relaxed stackable four column grid mb-5">
          <div className="ui one wide column"></div>

          <div className="ui five wide column">
            <RoundedImage
              url={this.props.auth.user.imageURL}
              className="moving mt-5 ui centered medium"
            />

            <div className="ui center aligned huge header  hover-right text-teal">
              <Link to="/insights" className="mt-5 underline">
                Insights
              </Link>
            </div>

            {/* <div className="ui center aligned huge header  hover-right text-teal">
              <Link to="/insights" className="mt-5 underline">
                Re-import My Data
              </Link>
            </div> */}
          </div>

          <div className="ui middle aligned eight wide column">
            <div className="ui left aligned container">
              <div className="huge-header mt-5 mb-5 underline text-darkteal">
                {this.props.auth.user.username}
              </div>

              <span
                className="ui huge header text-teal underline"
                style={{ width: "auto" }}
              >
                Your Link
              </span>

              <div className="ui fluid action input mt-3">
                <input
                  type="text"
                  ref={(textarea) => (this.linkCopy = textarea)}
                  value={`https://www.music-tastify.com/#/compare/${this.props.auth.user.username}`}
                  style={{ width: "100%" }}
                />
                <button
                  className="ui teal icon button"
                  onClick={() => {
                    this.copyToClipboard(this.event, this.linkCopy);
                  }}
                >
                  <i className="copy icon"></i>
                </button>
              </div>

              {this.renderSocialButtons()}

              {/*  <span
                className="ui huge header text-teal underline mt-5"
                style={{ width: "auto" }}
              >
                Your Code
              </span>

              <div className="ui fluid action input mt-3">
                <input
                  type="text"
                  ref={(textarea) => (this.linkCode = textarea)}
                  value={`${this.props.auth.user.username}`}
                  style={{ width: "100%" }}
                />
                <button
                  className="ui teal icon button"
                  onClick={() => {
                    this.copyToClipboard(this.event, this.linkCode);
                  }}
                >
                  <i className="copy icon"></i>
                </button>
              </div> */}
            </div>
          </div>

          <div className="ui two wide column"></div>
        </div>

        <div className="mt-5 mb-5" />
        <div className="ui relaxed grid">
          <div className="ui fourteen wide computer sixteen wide mobile centered column">
            <span className="large-header underline text-teal">Matches</span>
            {!_.isEmpty(this.state.matches) && this.renderMatches()}
          </div>
        </div>
      </div>
    );
  };

  renderNotLoggedIn = () => {
    return (
      <div
        className="ui centered middle aligned grid"
        style={{ height: "60vh" }}
      >
        <div className="ui center aligned column">
          <button
            className="ui positive button"
            onClick={(e) => {
              this.setState({ processing: true });
              e.stopPropagation();

              let redirectURL = "";

              if (isMobile) {
                console.log(this.props);
                redirectURL = this.props.match.url;
              }

              this.props.loginUser(redirectURL);
            }}
          >
            <i className="spotify icon"></i>
            Sign In with Spotify
          </button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Dashboard | Music Tastify</title>
        </Helmet>
        {this.props.auth.isSignedIn && this.renderLoggedIn()}
        {!this.props.auth.isSignedIn && this.renderNotLoggedIn()}
        {this.state.processing && <LoadingSpinner />}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(Dashboard);
