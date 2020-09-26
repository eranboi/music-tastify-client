import axios from "axios";
import Cookies from "js-cookie";
import axiosAuth from "../api";
import _ from "lodash";
import config from "../config";

export const signInUser = (user) => async (dispatch) => {
  try {
    console.log(user);
    console.log("SIGN IN");
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: "SIGN_IN",
      payload: user,
    });
  } catch (err) {
    dispatch({
      type: "SIGN_IN_ERROR",
      payload: err.response.data.error,
    });
  }
};

export const autoSignIn = () => async (dispatch) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user === undefined || !user) {
      return;
    }
    dispatch({
      type: "AUTO_SIGN_IN",
      payload: user,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const signOut = () => (dispatch) => {
  localStorage.removeItem("user");
  Cookies.remove("SESSION_MUSIC_TASTIFY");

  dispatch({
    type: "SIGN_OUT",
  });
};

export const getUserInfo = (username) => async (dispatch) => {
  try {
    const response = await axios.get(`${config.baseURL}users/${username}`);

    if (response) {
      dispatch({
        type: "USER_INFO",
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
