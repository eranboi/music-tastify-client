const INITIAL_STATE = {
  user: null,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "USER_INFO":
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case "USER_INFO_ERROR":
      return {
        ...state,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
