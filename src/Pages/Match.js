import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import CountUp from "react-countup";
import Cookies from "js-cookie";
import axios from "axios";
import ReactGA from "react-ga";

import TrackCard from "../Components/TrackCard";
import { getUserInfo } from "../actions";
import RoundedImage from "../Components/RoundedImage";
import CompareImage from "../Components/CompareImage";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Helmet } from "react-helmet";
import config from "../config";

class Match extends Component {
  state = {
    artists_long_term: [],
    artists_medium_term: [],
    tracks_long_term: [],
    tracks_medium_term: [],
    genres: [],
    match: 0,
    calculating: true,
    chartData: {},
    matchName: "",
    otherUser: null,
  };

  componentDidMount = async () => {
    try {
      const id = this.props.match.params.id;
      const cookie = Cookies.get("SESSION_MUSIC_TASTIFY");
      const userToken = JSON.parse(cookie);

      const response = await axios.get(`${config.baseURL}users/match/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken.token}`,
        },
      });

      this.setState({
        artists_long_term: response.data.artists_long_term,
        artists_medium_term: response.data.artists_medium_term,
        tracks_long_term: response.data.tracks_long_term,
        tracks_medium_term: response.data.tracks_medium_term,
        match: response.data.match,
        calculating: false,
        matchName: response.data.id,
        otherUser: response.data.userInfo,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error.message);
      ReactGA.event({
        category: "ERROR",
        action: error.message,
      });
    }
  };

  mostListenedArtistLongTerm = () => {
    return (
      <div className="ui stackable two column grid mt-5">
        <div className="six wide column mt-5">
          <RoundedImage
            url={this.state.artists_long_term[0].images[0].url}
            className="ui centered large"
          />
        </div>
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.state.artists_long_term[0].name}
              </span>{" "}
              it is!
            </div>
          </div>
        </div>
      </div>
    );
  };

  artistsLongTerm = () => {
    return (
      <div className="ui centered grid">
        {this.state.artists_long_term.map((artist, i) => {
          if (i > 0 && i < 7)
            return <TrackCard url={artist.images[1].url} name={artist.name} />;
        })}
      </div>
    );
  };

  longTermArtistsSection = () => {
    return (
      <div className="section tracks mb-5">
        <div className="large-header text-teal underline mt-5">
          Artists You Both Love The Most (All Time)
        </div>
        {this.mostListenedArtistLongTerm()}
        {this.artistsLongTerm()}
      </div>
    );
  };

  mostListenedArtistMediumTerm = () => {
    return (
      <div className="ui stackable two column grid mt-5">
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.state.artists_medium_term[0].name}
              </span>
              it is!
            </div>
          </div>
        </div>
        <div className="six wide column mt-5">
          <RoundedImage
            url={this.state.artists_medium_term[0].images[0].url}
            className="ui centered large"
          />
        </div>
      </div>
    );
  };

  artistsMediumTerm = () => {
    return (
      <div className="ui centered grid">
        {this.state.artists_medium_term.map((artist, i) => {
          if (i > 0 && i < 7)
            return <TrackCard url={artist.images[1].url} name={artist.name} />;
        })}
      </div>
    );
  };

  mediumTermArtistsSection = () => {
    return (
      <div className="section tracks mb-5">
        <div className="large-header text-teal underline mt-5">
          Artist You Both Love To Listen Currently (6 Months)
        </div>
        {this.mostListenedArtistMediumTerm()}
        {this.artistsMediumTerm()}
      </div>
    );
  };

  mostListenedSongLongTerm = () => {
    return (
      <div className="ui stackable mobile reversed two column grid mt-5">
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.state.tracks_long_term[0].name}
              </span>{" "}
              it is!
            </div>
          </div>
        </div>

        <div className="six wide column mt-5">
          <RoundedImage
            url={this.state.tracks_long_term[0].album.images[0].url}
            className="ui centered large"
          />
        </div>
      </div>
    );
  };

  tracksLongTerm = () => {
    return (
      <div className="ui centered grid">
        {this.state.tracks_long_term.map((track, i) => {
          if (i > 0 && i < 7)
            return (
              <TrackCard
                url={track.album.images[1].url}
                name={track.name}
                artists={track.artists}
              />
            );
        })}
      </div>
    );
  };

  longTermSection = () => {
    return (
      <div className="section tracks mb-5">
        <div className="large-header text-teal underline mt-5">
          Songs You Both Love The Most (All Time)
        </div>
        {this.mostListenedSongLongTerm()}
        {this.tracksLongTerm()}
      </div>
    );
  };

  mostListenedSongShortTerm = () => {
    return (
      <div className="ui stackable two column grid mt-5">
        <div className="six wide column mt-5">
          <RoundedImage
            url={this.state.tracks_medium_term[0].album.images[0].url}
            className="ui centered large"
          />
        </div>
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.state.tracks_medium_term[0].name}
              </span>
              it is!
            </div>
          </div>
        </div>
      </div>
    );
  };

  tracksShortTerm = () => {
    return (
      <div className="ui centered grid">
        {this.state.tracks_medium_term.map((track, i) => {
          if (i > 0 && i < 7)
            return (
              <TrackCard
                url={track.album.images[1].url}
                name={track.name}
                artists={track.artists}
              />
            );
        })}
      </div>
    );
  };

  shortTermSection = () => {
    console.log("short term");
    return (
      <div className="section tracks mb-5">
        <div className="large-header text-teal underline mt-5">
          You Both Listened To These The Most Currently (last 6 months)
        </div>
        {this.mostListenedSongShortTerm()}
        {this.tracksShortTerm()}
      </div>
    );
  };

  renderUsers = () => {
    console.log(this.state.otherUser);
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
                  url={this.state.otherUser.imageURL}
                  className="ui centered compare-image"
                />
                <div className="ui center aligned header text-teal">
                  {this.state.otherUser.username}
                </div>
              </div>
            </div>
          </div>

          <div className="ui center aligned ten wide column">
            <div className="ui huge horizontal statistic">
              <div className="value">
                <CountUp end={this.state.match} />
              </div>
              <div className="label">%</div>
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
              url={this.state.otherUser.imageURL}
              className="centered compare-image"
            />
            <div className="ui center aligned header text-teal">
              {this.state.otherUser.username}
            </div>
          </div>

          <div className="ui sixteen wide column">
            <div className="ui huge horizontal statistic">
              <div className="value">
                <CountUp end={this.state.match} />
              </div>
              <div className="label">%</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  renderResult = () => {
    return (
      <>
        {!_.isEmpty(this.state.artists_long_term) &&
          this.longTermArtistsSection()}
        {!_.isEmpty(this.state.artists_medium_term) &&
          this.mediumTermArtistsSection()}
        {!_.isEmpty(this.state.tracks_long_term) && this.longTermSection()}
        {!_.isEmpty(this.state.tracks_medium_term) && this.shortTermSection()}
      </>
    );
  };

  render() {
    if (this.props.auth.isSignedIn) {
      if (!this.state.calculating)
        return (
          <div className="ui container">
            <Helmet>
              <meta charSet="utf-8" />
              <title>{this.state.matchName}</title>
            </Helmet>

            {this.renderUsers()}

            {this.renderResult()}
          </div>
        );

      if (this.state.calculating) {
        return (
          <>
            <Helmet>
              <meta charSet="utf-8" />
              <title>{this.state.matchName}</title>
            </Helmet>
            <LoadingSpinner message="Calculating..." />
          </>
        );
      }
    }
    return <div></div>;
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth, otherUser: state.otherUser };
};
export default connect(mapStateToProps, { getUserInfo })(Match);
