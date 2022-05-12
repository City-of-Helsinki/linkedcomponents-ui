module.exports = function override(config) {
  //do stuff with the webpack config...
  config.resolve.fallback = {
    path: require.resolve('path-browserify'),
  };

  return {
    ...config,
    ignoreWarnings: [
      /Failed to parse source map/,
      /Replace color-adjust to print-color-adjust./,
    ],
  };
};
