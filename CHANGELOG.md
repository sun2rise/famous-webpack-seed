# Changelog

### 0.5.0 (05/08/2014) Major refactor

* simplified README
* changed `--sync` to `--reload` and moved code to webpack plugin: `webpack-reload-plugin`
* created seperate `webpack.cordova.js` and moved code to webpack plugin: `webpack-cordova-plugin`
* removed cordova `www` directory, `plugins` directory and `config.xml`. They are automatically created when needed. 
* removed `--bundle` options (just modify your `entry` in config if you want to change this)
* changed `--target` option to `--env` (target was already used as argument)

### 0.4.0 (04/08/2014)

* renamed `--app` flag to `--bundle`
* added changelog

### 0.3.0 (04/08/2014)

* use `copy-loader` and `copy-url-loader` to create independent bundles.