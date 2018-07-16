const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const HardSourcePlugin = require('hard-source-webpack-plugin');

const commonConfig = require('./webpack.config.common');
const parts = require('./webpack.parts');

const developmentConfig = merge([
  parts.setFreeVariable('process.env.NODE_ENV', 'development'),
  parts.setFreeVariable('process.env.DEBUG_WORKBOX', process.env.DEBUG_WORKBOX),
  commonConfig,
  {
    mode: 'development',
    // Use a fast source map for good-enough debugging usage
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'cheap-module-eval-source-map',
    entry: [
      'react-hot-loader/patch',
      // Modify entry for hot module reload to work
      // See: https://survivejs.com/webpack/appendices/hmr/#setting-wds-entry-points-manually
      'webpack-dev-server/client',
      'webpack/hot/only-dev-server',
      'main',
    ],
    output: {
      pathinfo: false,
    },
    plugins: [
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // new WatchMissingNodeModulesPlugin(parts.PATHS.node),
      new HtmlWebpackPlugin({
        template: path.join(parts.PATHS.app, 'index.html'),
        cache: true,
      }),
      // Copy files from static folder over (in-memory)
      new CopyWebpackPlugin([
        { from: 'static', context: parts.PATHS.root, ignore: ['short_url.php'] },
      ]),
      // Ignore node_modules so CPU usage with poll watching drops significantly.
      new webpack.WatchIgnorePlugin([parts.PATHS.node, parts.PATHS.build]),
      new webpack.HotModuleReplacementPlugin(),
      new HardSourcePlugin(),
    ],
  },
  process.env.DEBUG_WORKBOX ? parts.workbox() : {},
  parts.loadImages({
    include: parts.PATHS.images,
  }),
  parts.loadCSS({
    localIdentName: '[name]-[local]_[hash:base64:4]',
  }),
  parts.flow({ failOnError: false }),
]);

module.exports = developmentConfig;
