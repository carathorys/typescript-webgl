import path from 'path';
import webpack from 'webpack';

import _ from 'lodash';

import Clean from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import CheckerPlugin from 'awesome-typescript-loader';

// Root app path
let rootDir = path.resolve(__dirname, '..');
let cleanDirectories = ['build', 'dist'];
// Plugins configuration
let plugins = [new webpack.NoErrorsPlugin()];

// Default value for development env
let outputPath = path.join(rootDir, 'build');
let suffix = 'dev';

let config = {
  resolve: {
    modulesDirectories: ['src', 'node_modules', 'local_modules'],
    extensions: ['', '.js', '.ts']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader',
    }],
    // allow local glslify/browserify config to work
    postLoaders: [{
      test: /\.js$/,
      loader: 'ify'
    }],
    loaders: [{
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: "tsconfig.webpack.json"
        },
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /node_modules/,
        loader: 'ify'
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

  let entryAppPath = [path.resolve(__dirname, '../src/app.ts'), path.resolve(__dirname, '../src/vendor.ts')];

  if (prod) {
    suffix = 'prod';
    outputPath = path.join(rootDir, 'dist');
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        warnings: false,
        minimize: true,
        sourceMap: false
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

  plugins.push(
    new CopyWebpackPlugin([{
      from: 'src/textures',
      to: 'textures'
    }, ])
  );

  plugins.push(
    new webpack.optimize.DedupePlugin()
  );

  plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(true)
  );

  if (!prod) {
    entryAppPath.push('webpack/hot/dev-server');
  }

  return _.merge({}, config, {
    entry: {
      bundle: entryAppPath,
    },
    output: {
      path: outputPath,
      filename: '[name]' + hash + '.js'
    },
    plugins: plugins
  });
};