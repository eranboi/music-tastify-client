import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userInfoReducer from "./userInfoReducer";

export default combineReducers({
  auth: authReducer,
  otherUser: userInfoReducer,
});
