let webpack = require('webpack');
let path = require('path');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./webpack.base.config.js');

let basePath = __dirname;

module.exports = function () {
  return webpackMerge(commonConfig, {
    // For development https://webpack.js.org/configuration/devtool/#for-development
    devtool: 'inline-source-map',

    output: {
      path: path.join(basePath, 'dist'),
      filename: '[name].js'
    },

    module: {
      rules: [
        // Loading pipe for stylesheets as modules.
        {
          test: /\.scss$/,
          exclude: [/node_modules/],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]__[name]',
                camelCase: true
              }
            },
            'sass-loader'
          ]
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          DEBUG_TRACES: true
        }
      })
    ],

    devServer: {
      port: 8080
    }
  });
}
