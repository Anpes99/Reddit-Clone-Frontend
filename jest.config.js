module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // for JavaScript files
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  // other configurations...
};
