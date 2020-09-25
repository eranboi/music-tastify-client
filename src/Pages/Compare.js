import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Cookies from "js-cookie";
import axios from "axios";
import { isMobile } from "react-device-detect";
import ReactGA from "react-ga";

import { getUserInfo } from "../actions";
import CompareImage from "../Components/CompareImage";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Helmet } from "react-helmet";
import config from "../config";

class Compare extends Component {
  state = { processing: false, calculating: false, himself: false };

  componentDidMount() {
    const name = this.props.match.params.name;

    this.props.getUserInfo(name);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.auth.isSignedIn && this.state.processing) {
      this.setState({ processing: false });

      if (this.props.otherUser.user) {
        if (
          this.props.otherUser.user.username === this.props.auth.user.username
        ) {
          this.setState({ himself: true });
          setTimeout(() => {
            this.props.history.push("/");
          }, 3000);
        }
      }
    }
  };

  calculateCompatibility = async () => {
    this.setState({ calculating: true });
    const { user } = this.props.auth;
    const otherUser = this.props.otherUser.user;

    let resultLongTermArtists = null;
    let resultMediumTermArtists = null;
    let resultLongTermTracks = null;
    let resultMediumTermTracks = null;
    let resultGenres = null;
    resultLongTermArtists = _.intersectionBy(
      user.artists.long_term,
      otherUser.artists.long_term,
      "id"
    );
    resultMediumTermArtists = _.intersectionBy(
      user.artists.medium_term,
      otherUser.artists.medium_term,
      "id"
    );
    resultLongTermTracks = _.intersectionBy(
      user.tracks.long_term,
      otherUser.tracks.long_term,
      "id"
    );
    resultMediumTermTracks = _.intersectionBy(
      user.tracks.medium_term,
      otherUser.tracks.medium_term,
      "id"
    );
    resultGenres = _.intersectionBy(user.genres, otherUser.genres, "genre");

    while (resultGenres.length > 30) {
      resultGenres.pop();
    }

    const artistCount =
      resultLongTermArtists.length + resultMediumTermArtists.length;
    const trackCount =
      resultMediumTermTracks.length + resultLongTermTracks.length;
    const genreCount = resultGenres.length;

    const match = genreCount * 5 + artistCount * 2 + trackCount * 3;
    const percentage = (match / 450) * 100;

    this.setState({
      calculating: false,
    });

    const matchData = {
      artists_long_term: resultLongTermArtists,
      artists_medium_term: resultMediumTermArtists,
      tracks_long_term: resultLongTermTracks,
      tracks_medium_term: resultMediumTermTracks,
      match: percentage,
    };

    try {
      const userToken = JSON.parse(Cookies.get("SESSION_MUSIC_TASTIFY"));

      console.log(userToken);
      const response = await axios.post(
        `${config.baseURL}users/match/${this.props.otherUser.user._id}`,
        { match: matchData },
        {
          headers: {
            Authorization: `Bearer ${userToken.token}`,
          },
        }
      );

      if (response) this.props.history.push(`/match/${response.data}`);
    } catch (error) {
      console.log(error.message);
      ReactGA.event({
        category: "ERROR",
        action: error.message,
      });
    }
  };

  renderLoader = () => {
    return <LoadingSpinner message="Logging In" />;
  };

  renderCalculating = () => {
    return <LoadingSpinner message="Calculating" />;
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

  renderLoggedIn = () => {
    if (this.props.otherUser.user)
      return (
        <div className="ui centered grid">
          <div className="ui centered middle aligned column">
            {this.renderUsers()}
            <button
              className="ui positive centered button mt-5"
              onClick={() => {
                this.calculateCompatibility();
              }}
            >
              Match!
            </button>
          </div>
        </div>
      );
    else {
      return <LoadingSpinner message="Fetching Data" />;
    }
  };

  renderYourself = () => {
    return (
      <div className="ui centered middle aligned column">
        <div className="ui column">You can not do this with yourself</div>
      </div>
    );
  };

  renderUsers = () => {
    return (
      <>
        <div className="ui centered middle aligned two column grid hidden-mobile">
          <div className="ui six wide column ">
            <div className="ui centered middle aligned three column grid hidden-mobile">
              <div className="ui six wide column ">
                <CompareImage
                  url={this.props.auth.user.imageURL}
                  className="ui centered compare-image"
                />
                <div className="ui center aligned header text-teal">
                  {this.props.auth.user.username}
                </div>
              </div>
              <div className="ui two wide column ">
                <i className="x big icon"></i>
              </div>
              <div className="ui six wide column ">
                <CompareImage
                  url={this.props.otherUser.user.imageURL}
                  className="ui centered compare-image"
                />
                <div className="ui center aligned header text-teal">
                  {this.props.otherUser.user.username}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ui centered middle aligned three column grid mobile-only">
          <div className="ui seven wide column">
            <CompareImage
              url={this.props.auth.user.imageURL}
              className="centered compare-image"
            />
            <div className="ui center aligned header text-teal">
              {this.props.auth.user.username}
            </div>
          </div>

          <div className="ui two wide column ">
            <i className="x big icon"></i>
          </div>

          <div className="ui seven wide column">
            <CompareImage
              url={this.props.otherUser.user.imageURL}
              className="centered compare-image"
            />
            <div className="ui center aligned header text-teal">
              {this.props.otherUser.user.username}
            </div>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="ui container">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Compare | Music Tastify</title>
        </Helmet>
        {this.state.processing && this.renderLoader()}
        {this.state.calculating && this.renderCalculating()}
        {!this.props.auth.isSignedIn && this.renderNotLoggedIn()}
        {this.props.auth.isSignedIn &&
          !this.state.himself &&
          this.renderLoggedIn()}
        {this.state.himself && this.renderYourself()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth, otherUser: state.otherUser };
};
export default connect(mapStateToProps, { getUserInfo })(Compare);
