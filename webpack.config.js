"use strict";
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".tsx", ".ts", ".jsx", ".js"]
  },
  entry: {
    App: "./client/index.tsx",
  },
  output: {
    path: path.join(__dirname, "./public"),
    filename: "bundle.js"
    //filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
  ]
};
