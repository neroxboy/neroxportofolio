const path = require('path');

module.exports = {
  // ...existing code...
  resolve: {
    fallback: {
      "fs": require.resolve("browserify-fs"),
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "stream": require.resolve("stream-browserify")
    }
  }
};
