#Famous-Webpack-Seed
> A seed project to get started with Webpack and Famo.us. 
> Optional support for Cordova.

###Features

* Your app is split into multiple bundles: `./src/xxxx/main.js` > `./dist/xxxx/bundle.js`
* Require **.jade**, **.coffee** and **.less**
* Support multiple configurations in your code: set `window.ENV` using the `--env` flag.
* Support for **Cordova/Phonegap**

---

### Getting started with Famo.us and webpack

####Installation

```bash
npm install -g webpack webpack-dev-server # install webpack
git clone https://github.com/markmarijnissen/famous-webpack-seed # clone this repository
# rm -rf .git # optionally remove git history
npm install # install dependencies
```

####Development

```bash
webpack-dev-server --reload=localhost
```

Now navigate to:

* [http://localhost:8080/boilerplate/index.html](http://localhost:8080/boilerplate/index.html)
* [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server) (lists all bundles)

The optional `--reload=ip` flag [adds the live-reload snippet](https://github.com/markmarijnissen/webpack-reload-plugin) to your bundle(s).


####Production
```bash
webpack --minify --env=production
```

* The optional `--minify` flag minifies the output.
* The optional `--env=xxx` flag sets a global `ENV` variable (default: `window.TARGET='dev'`).

---

### Getting started with Cordova 

####Installation:

```bash
npm install -g cordova
webpack --config webpack.cordova.js  # automatically creates a Cordova config.xml
# change app ID in config.xml (optional)
cordova platform add ios # or android
```

The `webpack.cordova.js` configuration uses the [webpack-cordova-plugin](https://github.com/markmarijnissen/webpack-cordova-plugin) to add Cordova to your project.

####Development:

```bash
webpack-dev-server --config webpack.cordova.js --reload=192.168.0.1 --ios # or --android

# in seperate terminal-tab, launch cordova
cordova run ios # or android
```

* The `--reload` flag enables live reloading, and points Cordova to your **webpack-dev-server**.

* The `--ios` or `--android` flags ensure the correct Cordova and plugin javascript is loaded. The javascript is different for each platform and located at `platform/ios/www ` or `platform/android/assets/www `.

####Production:
```bash
webpack --config webpack.cordova.js
cordova run ios # or android
```

####Cordova troubleshooting
For more information and troubleshooting see the [webpack-cordova-plugin](https://github.com/markmarijnissen/webpack-cordova-plugin).

---

#### Advanced usage: extend this config

1. Install `famous-webpack-seed` as npm module.
  ```bash
  npm install famous-webpack-seed --save-dev
  ```

2. Now you can extend your `webpack.config.js` as follows:
   ```js
   var config = require('famous-webpack-seed');
   config.entry = './src/app.js'
   // etc
   ```


## Contributors

Like it? Show some love and star this project!

* Based on the original seed from [Adrian Rossouw](https://github.com/Vertice/famous-webpack-seed)
* Bugfix from [Tony Alves](https://github.com/talves/)