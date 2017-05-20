let webpack = require("webpack");
let path = require("path");
let webpackMerge = require("webpack-merge");
let commonConfig = require("./webpack.base.config.js");

let basePath = __dirname;

module.exports = function () {
  return webpackMerge(commonConfig, {
    // For development https://webpack.js.org/configuration/devtool/#for-development
    devtool: "inline-source-map",

    output: {
      path: path.join(basePath, "dist"),
      filename: "[name].js"
    },

    module: {
      rules: [
        // Loading pipe for user SASS stylesheets as modules.
        {
          test: /\.scss$/,
          exclude: [/node_modules/],
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                camelCase: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: "[local]__[name]___[hash:base64:5]"
              }
            },
            "sass-loader"
          ]
        },
        // Loading pipe for external PostCSS stylesheets as modules
        // required by react-toolbox. Lets be more specific in DEV mode
        // and tag react-toolbox themes so they can be easily identifying
        // when debuggin DOM elements and classes.
        {
          test: /\.css$/,
          include: [/react-toolbox/],
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: "[local]__rtb-[name]___[hash:base64:5]"
              }
            },
            "postcss-loader"
          ]
        },
        {
          test: /\.css$/,
          exclude: [/react-toolbox/],
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: "[local]__[name]___[hash:base64:5]"
              }
            },
            "postcss-loader"
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
