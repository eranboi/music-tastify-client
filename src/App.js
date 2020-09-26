import React from "react";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { isMobile } from "react-device-detect";
import { createBrowserHistory } from "history";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { autoSignIn, signInUser } from "./actions";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Compare from "./Pages/Compare";
import Dashboard from "./Pages/Dashboard";
import Insights from "./Pages/Insights";
import Login from "./Pages/Login";
import Match from "./Pages/Match";
import ReactGA from "react-ga";
import config from "./config";

const history = createBrowserHistory();

const GA_tracking_id = "UA-162115241-2";

ReactGA.initialize(GA_tracking_id);

history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

Sentry.init({
  dsn:
    "https://83a7ebd262c646e3a4f3be62072fe93d@o445795.ingest.sentry.io/5423045",
});
class App extends React.Component {
  state = {};

  loginUser = (redirectURL = "") => {
    ReactGA.event({
      category: "Sign In",
      action: "User clicked a login button.",
    });
    if (isMobile) {
      window.location.href = `${config.baseURL}login?redirect_to=${redirectURL}`;
    } else {
      window.open(`${config.baseURL}login? `, "_blank", "width=500,height=700");

      this.startListening();
    }
  };

  startListening = () => {
    this.props.autoSignIn();

    const eventListener = window.addEventListener("message", (message) => {
      if (message) {
        window.removeEventListener("message");
        message.data
          ? this.props.autoSignIn()
          : console.log("Couldn't sign in!");
      }

      //#region EVENT LISTENER FOR MESSAGES
      /*       let messageParsed = null;
          if (message) {
        try {
          let messageStringified = JSON.stringify(message.data);

          window.removeEventListener("message", eventListener);

          messageParsed = JSON.parse(messageStringified);

          let messageParsedTwice = JSON.parse(messageParsed);

          if (messageParsed) this.props.signInUser(messageParsed.user);

          console.log(messageParsedTwice, "startListening");
        } catch (error) {
          console.log(error);
        }

        this.props.signInUser(messageParsed.user);

        if (process.env.NODE_ENV == "development") console.log(messageParsed);

        Cookies.set(
          "SESSION_MUSIC_TASTIFY",
          JSON.stringify({ token: messageParsed.token })
        );

        localStorage.setItem("user", JSON.stringify(messageParsed.user));
      } else {
        console.log("message not received");
      } */
      //#endregion
    });
  };

  componentDidMount() {
    if (!this.props.auth.isSignedIn) this.props.autoSignIn();
  }

  render() {
    return (
      <HashRouter>
        <Navbar
          startListening={this.startListening}
          loginUser={this.loginUser}
        />

        <div style={{ marginTop: "56px" }}>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route
              path="/compare/:name"
              exact
              render={(props) => (
                <Compare
                  {...props}
                  startListening={this.startListening}
                  loginUser={this.loginUser}
                />
              )}
            />
            <Route
              path="/dashboard"
              exact
              render={(props) => (
                <Dashboard
                  {...props}
                  startListening={this.startListening}
                  loginUser={this.loginUser}
                />
              )}
            />
            <Route
              path="/insights"
              exact
              render={(props) => (
                <Insights
                  {...props}
                  startListening={this.startListening}
                  loginUser={this.loginUser}
                />
              )}
            />
            <Route path="/login" exact component={Login} />
            <Route path="/match/:id" exact component={Match} />
          </Switch>
        </div>

        <footer>
          <p>
            Made with ❤️ by
            <a href="https://www.twitter.com/eranboii">
              <span className="text-teal"> Erhan Koca</span>
            </a>
          </p>
          <p>
            To suggest a feature or report a bug send me a message
            <a href="https://www.twitter.com/eranboii">
              <span className="text-teal"> here </span>
            </a>
          </p>
        </footer>
      </HashRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, { autoSignIn, signInUser })(App);
