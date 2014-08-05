var CordovaPlugin = require('webpack-cordova-plugin');
/**
 * Extend the default config.
 */
var config = require('./webpack.config.js');

/**
 * Add the Webpack Cordova Plugin
 */
config.plugins.push(new CordovaPlugin({
  config: 'config.xml',                     // Location of Cordova' config.xml (will be created if not found)
  src: 'boilerplate/index.html',            // Set entry-point of cordova in config.xml
  version: true,                            // Set config.xml' version. (true = use version from package.json)
}));

/**
 * Set webpack-dev-server content-base. This is equired to load the correct Cordova Javascript.
 * 
 * WARNING: Not yet supported!!!
 * Use the --content-base=platform/ios/www option instead!
 * (see: https://github.com/webpack/webpack-dev-server/pull/41)
 */
config.devServer = {
   contentBase: 'platforms/ios/www'
// contentBase: 'platforms/android/assets/www'
};

module.exports = config;



