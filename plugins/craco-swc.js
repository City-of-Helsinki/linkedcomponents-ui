/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

module.exports = {
  /**
   * To process the js/ts files we replace the babel-loader with the swc jest loader
   */
  overrideJestConfig: ({ jestConfig, pluginOptions, context: { paths } }) => {
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const appSwcConfig = path.resolve(paths.appPath, '.swcrc');
    const useSwcConfig = fs.existsSync(appSwcConfig);
    const swcConfig = useSwcConfig
      ? JSON.parse(fs.readFileSync(appSwcConfig, 'utf-8'))
      : null;

    // Replace babel transform with swc
    const key = Object.keys(jestConfig.transform)[0];
    // TODO find a way to pass options directly to the plugin without having to use a .swcrc
    jestConfig.transform[key] = [
      require.resolve('@swc/jest'),
      swcConfig
        ? swcConfig
        : {
            sourceMaps: true,
            jsc: {
              preserveAllComments: true,
              target: 'es2021',
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
              parser: useTypeScript
                ? {
                    syntax: 'typescript',
                    tsx: true,
                    dynamicImport: true,
                  }
                : {
                    syntax: 'ecmascript',
                    jsx: true,
                    dynamicImport: true,
                  },
            },
          },
    ];

    return jestConfig;
  },
};
