import axios from "axios";
import Cookies from "js-cookie";
import config from "../config";
const localStorageUser = localStorage.getItem("user");

let userToken = "";
let cookie = null;
try {
  if (localStorageUser) {
    const user = JSON.parse(localStorageUser);
  }
  cookie = Cookies.get("SESSION_MUSIC_TASTIFY");
  if (cookie) userToken = JSON.parse(cookie);
} catch (err) {}

export default axios.create({
  baseURL: config.baseURL,
  headers: { Authorization: `Bearer ${userToken != "" && userToken.token}` },
});
