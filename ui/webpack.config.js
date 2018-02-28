var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, '../app/static');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/App.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015',"react"]
        }
      }
    }
  ]
  }
};

module.exports = config;