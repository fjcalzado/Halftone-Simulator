let path = require('path');
let webpackMerge = require('webpack-merge');
let commonConfig = require('./base.webpack.config.js');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let basePath = __dirname;

module.exports = function () {
  return webpackMerge(commonConfig, {
    // For production https://webpack.js.org/configuration/devtool/#for-development
    devtool: 'cheap-module-source-map',

    output: {
      path: path.join(basePath, 'dist'),
      filename: '[chunkhash].[name].js'
    },

    module: {
      rules: [
        // Loading pipe for Styles except the main page style.
        // ExtractTextPlugin used to extract all bundled CSS into a separate file.
        // NOTE: If this CSS doesn't weight too much, better leave it injected (disable plugin).
        {
          test: /\.scss$/,
          exclude: [/node_modules/, /pageStyles.scss/],
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]--[hash:base64:5]',
                  camelCase: true
                }
              },
              { loader: 'sass-loader' }
            ]
          })
        },
        // Loading pipe for the main page style. We do not want hashed rule names for this stylesheet
        // so we can directly anotate style class names in the markup.
        // ExtractTextPlugin used to extract all bundled CSS into a separate file.
        // NOTE: If this CSS doesn't weight too much, better leave it injected (disable plugin).
        {
          test: /\.scss$/,
          include: /pageStyles.scss/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader' },
              { loader: 'sass-loader' } ]
          })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin({
        filename: '[chunkhash].[name].css',
        disable: false,
        allChunks: true
      })
    ]
  });
}
