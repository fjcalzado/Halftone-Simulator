let webpack = require("webpack");
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let CopyWebpackPlugin = require('copy-webpack-plugin');

let basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"]
  },
  entry: {
    bundle: ["./app/app.tsx"]
    // TODO: Ask why separating vendor into a different bundle creates a heavier result?
    // vendor: ["d3", "react", "react-dom", "react-css-themr", "react-addons-css-transition-group", 
    //  "react-sortable-hoc", "react-toolbox", "postcss"]
  },
  module: {
    // *** Typescript ***
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "awesome-typescript-loader",
        options: {
          useBabel: true
        }
      }
    },
    // *** Images ***
    {
      test: /\.(png|svg|jpg|gif|bmp)$/,
      exclude: [/node_modules/],
      use: [{
        loader: "file-loader",
        options: {
          name: "public/images/[name].[ext]"
        }
      }]
    },
    // *** Fonts ***
    {
      test: /\.woff$/,
      loader: "url-loader?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]"
    },
    {
      test: /\.woff2$/,
      loader: "url-loader?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]"
    },
    {
      test: /\.[ot]tf$/,
      loader: "url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]"
    },
    {
      test: /\.eot$/,
      loader: "url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]"
    }]
  },
  plugins: [
    // Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "index.html", //Name of template in ./src
      hash: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"]
    }),
    new CopyWebpackPlugin([
      {context: "app/favicon", from: "**/*", to: "public/favicon"}
    ])
  ]
};


