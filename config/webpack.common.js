const _ = require("lodash");
const path = require('path');
const webpack = require('webpack');
const Clean = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

// Root app path
let rootDir = path.resolve(__dirname, '..');
let cleanDirectories = ['build', 'dist'];
// Plugins configuration
let plugins = [new webpack.NoEmitOnErrorsPlugin()];

// Default value for development env
let outputPath = path.join(rootDir, 'build');
let suffix = 'dev';

let config = {
  cache: false,
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['src', 'node_modules', 'local_modules']
  },
  devtool: "source-map",

  module: {
    // rules: [{
    //     test: /\.ts$/,
    //     enforce: 'pre',
    //     loader: 'tslint-loader'
    //   },
    //   // {
    //   //   test: /\.js$/,
    //   //   enforce: 'post',
    //   //   loader: 'ify-loader'
    //   // }
    // ],
    // allow local glslify/browserify config to work
    // postLoaders: [{
    //   test: /\.js$/,
    //   loader: 'ify'
    // }],
    loaders: [{
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /node_modules/,
        loader: 'ify-loader'
      },
      {
        test: /\.css$/,
        loaders: ['to-string-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['to-string-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
};

module.exports = function configuration(options) {
  let prod = options.production;

  let hash = prod ? '-[hash]' : '';

  let entryAppPath = {
    'app': path.resolve(__dirname, '../src/app.ts'),
    // 'vendor': path.resolve(__dirname, '../src/vendor.ts')
  };

  if (prod) {
    suffix = 'prod';
    outputPath = path.join(rootDir, 'dist');
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        beautify: false, //prod
        output: {
          comments: false
        }, //prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        },
      })
    );
  }

  // Plugin configuration
  plugins.push(new Clean(cleanDirectories, rootDir));
  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/html/index.' + suffix + '.html'
    })
  );

  plugins.push(new CheckerPlugin());

  // plugins.push(new webpack.optimize.CommonsChunkPlugin({
  //   name: "vendor",
  //   filename: "vendor.bundle.js"
  // }));

  plugins.push(
    new CopyWebpackPlugin([{
      from: 'src/textures',
      to: 'textures'
    }, ])
  );

  return _.merge({}, config, {
    entry: entryAppPath,
    output: {
      path: outputPath,
      filename: '[name]' + hash + '.js'
    },
    plugins: plugins
  });
};