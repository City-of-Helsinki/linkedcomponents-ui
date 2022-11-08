module.exports = {
  webpack: {
    configure: (webpackConfig) => ({
      ...webpackConfig,
      ignoreWarnings: [
        /Failed to parse source map/,
        /Replace color-adjust to print-color-adjust./,
      ],
      resolve: {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          path: require.resolve('path-browserify'),
          util: false,
        },
      },
    }),
  },
};
