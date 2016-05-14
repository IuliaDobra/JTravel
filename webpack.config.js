var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var argv = require('yargs').argv;


config = {
  entry: ['./src/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'bardo',
      template: 'src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new ExtractTextPlugin("style.css", {
      allChunks: true
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'ng-annotate!babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader','css-loader!sass-loader') },
      //{ test: /\.html$/, loader: 'ngtemplate?relativeTo='+ __dirname +'!html' },
      { test: /\.html$/, loader: 'ngtemplate!html' },
      { test: /\.jade$/, loader: 'jade-loader' },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      // helps to load bootstrap's css.
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2$/,
        loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  devtool: 'source-map'
};

module.exports = config;
