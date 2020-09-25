const config = {
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/"
      : "https://music-tastify-backend.herokuapp.com/",
};

module.exports = config;
