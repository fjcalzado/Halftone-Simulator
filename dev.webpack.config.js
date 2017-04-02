let path = require('path');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./base.webpack.config.js');

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
        // Loading pipe for Styles except the main page style.
        {
          test: /\.scss$/,
          exclude: [/node_modules/, /main.scss/],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]--[hash:base64:5]',
                camelCase: true
              }
            },
            'sass-loader'
          ]
        },
        // Loading pipe for the main page style. We do not want hashed rule names for this stylesheet
        // so we can directly anotate style class names in the markup.
        {
          test: /\.scss$/,
          include: /main.scss/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },

    devServer: {
      port: 8080
    }
  });
}
