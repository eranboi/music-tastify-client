import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";

import RoundedImage from "../Components/RoundedImage";
import TrackCard from "../Components/TrackCard";
import Chart from "../Components/Chart";
import LoadingSpinner from "../Components/LoadingSpinner";

class Insights extends Component {
  state = { chartData: null, processing: false };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.auth.isSignedIn && this.state.processing) {
      this.setState({ processing: false });
    }
  };

  renderIntro = () => {};

  readyChartData = () => {
    let labels = [];
    let data = [];
    let datasets = [];
    let genreCount = 0;

    this.props.auth.user.genres.map((genreData, i) => {
      if (i < 9) {
        genreCount += genreData.count;
      }
    });

    this.props.auth.user.genres.map((genreData, i) => {
      if (i < 9) {
        labels.push(genreData.genre);
        data.push(((genreData.count * 100) / genreCount).toFixed(2));
      }
    });

    datasets.push({
      backgroundColor: [
        "#ffadad",
        "#ffd6a5",
        "#fdffb6",
        "#caffbf",
        "#9bf6ff",
        "#a0c4ff",
        "#bdb2ff",
        "#ffc6ff",
        "#fffffc",
        "#00b4d8",
      ],
      data,
    });

    this.setState({ chartData: { labels, datasets } });
  };

  renderChart = () => {
    {
      !this.state.chartData && this.readyChartData();
    }
    return (
      <>
        <div className="ui centered two column grid mt-5 hidden-mobile">
          <div className="ui eight wide column ">
            <Chart data={this.state.chartData} height="347" />
          </div>
        </div>

        <div className="ui centered two column grid mt-5 mobile-only">
          <div className="ui fourteen wide column ">
            <Chart data={this.state.chartData} height="450" />
          </div>
        </div>
      </>
    );
  };

  mostListenedArtistLongTerm = () => {
    return (
      <div className="ui stackable two column grid mt-5">
        <div className="six wide column mt-5">
          <RoundedImage
            url={this.props.auth.user.artists.long_term[0].images[0].url}
            className="ui centered large"
          />
        </div>
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.props.auth.user.artists.long_term[0].name}
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
        {this.props.auth.user.artists.long_term.map((artist, i) => {
          if (i > 0 && i < 7)
            return <TrackCard url={artist.images[1].url} name={artist.name} />;
        })}
      </div>
    );
  };

  longTermArtistsSection = () => {
    return (
      <div className="section tracks mb-5">
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
                {this.props.auth.user.artists.medium_term[0].name}
              </span>
              it is!
            </div>
          </div>
        </div>
        <div className="six wide column mt-5">
          <RoundedImage
            url={this.props.auth.user.artists.medium_term[0].images[0].url}
            className="ui centered large"
          />
        </div>
      </div>
    );
  };

  artistsMediumTerm = () => {
    return (
      <div className="ui centered grid">
        {this.props.auth.user.artists.medium_term.map((artist, i) => {
          if (i > 0 && i < 7)
            return <TrackCard url={artist.images[1].url} name={artist.name} />;
        })}
      </div>
    );
  };

  mediumTermArtistsSection = () => {
    return (
      <div className="section tracks mb-5">
        {this.mostListenedArtistMediumTerm()}
        {this.artistsMediumTerm()}
      </div>
    );
  };

  mostListenedSongLongTerm = () => {
    return (
      <div className="ui stackable two column grid mt-5">
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.props.auth.user.tracks.long_term[0].name}
              </span>
              it is!
            </div>
          </div>
        </div>

        <div className="six wide column mt-5">
          <RoundedImage
            url={this.props.auth.user.tracks.long_term[0].album.images[0].url}
            className="ui centered large"
          />
        </div>
      </div>
    );
  };

  tracksLongTerm = () => {
    return (
      <div className="ui centered grid">
        {this.props.auth.user.tracks.long_term.map((track, i) => {
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
            url={this.props.auth.user.tracks.medium_term[0].album.images[0].url}
            className="ui centered large"
          />
        </div>
        <div className="ten wide middle aligned column mt-5">
          <div className="huge-header mt-5" style={{ marginLeft: "25px" }}>
            <div className="ui centered">
              <span className="text-teal">
                {this.props.auth.user.tracks.medium_term[0].name}
              </span>{" "}
              it is!{" "}
            </div>
          </div>
        </div>
      </div>
    );
  };

  tracksShortTerm = () => {
    return (
      <div className="ui centered grid">
        {this.props.auth.user.tracks.medium_term.map((track, i) => {
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
    return (
      <div className="section tracks mb-5">
        {this.mostListenedSongShortTerm()}
        {this.tracksShortTerm()}
      </div>
    );
  };

  renderLoggedIn = () => {
    return (
      <div className="ui container mt-5">
        <div className="large-header text-teal underline mt-5">
          Your Top Genres (%)
        </div>
        {this.renderChart()}

        <div className="large-header text-teal underline mt-5">
          All Time Favorite Artists
        </div>
        {this.longTermArtistsSection()}

        <div className="large-header text-teal underline mt-5">
          Current Favorite Artists
        </div>
        {this.mediumTermArtistsSection()}

        <div className="large-header text-teal underline mt-5">
          All Time Favorite Songs
        </div>
        {this.longTermSection()}

        <div className="large-header text-teal underline mt-5">
          Current Favorite Songs
        </div>
        {this.shortTermSection()}
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
          <title>Insights | Music Tastify</title>
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

export default connect(mapStateToProps)(Insights);
