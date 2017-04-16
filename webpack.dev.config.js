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
        // Loading pipe for stylesheets as modules. The only exception will be the main
        // page style which is intended to be global and not a module.
        {
          test: /\.scss$/,
          exclude: [/node_modules/, /main.scss/],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]_[local]--[hash:base64:5]',
                camelCase: true
              }
            },
            'sass-loader'
          ]
        },
        // Loading pipe for the main page style. We do not want hashed rule names for this
        // stylesheet to be able to anotate style class names in the markup.
        {
          test: /\.scss$/,
          include: /main.scss/,
          use: ['style-loader', 'css-loader', 'sass-loader']
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
