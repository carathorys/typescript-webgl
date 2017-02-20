require('babel-register')({
  presets: ["es2015"]
});

module.exports = require('./webpack.common')({
  production: true
});