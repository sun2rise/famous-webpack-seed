#Famous-Webpack-Seed
> A seed project to get started with Webpack and Famo.us

###Features

* Multiple bundles: Every directory in `./src/` is bundled as an app.
* Require Jade (`.jade`), LESS (`.less`) and Coffee (`.coffee`)
* Support for **Cordova/Phonegap**.

See `webpack --extra-options` for help:

```
Webpack builds every 'main.js' in /src/[bundle]/ to ./dist
Every directory in /src/ is bundled as a seperate app.

Extra options:
  -s, --sync[=ip]   Adds webpack-dev-server live-reload snippet to the bundle(s).
  -t, --target=xxx  Set a global TARGET variable (default: window.TARGET='dev')
  -m, --minify      Minify without mangle (default: false)
  -a, --app=xxx     Build a single src folder (default: all)

      --cordova=xxx Modify Cordova's ./config.xml
        
        * <config src="..."/> is updated to 'xxx' (default: app (if specified), index.html)
        * version is updated to version from `package.json`
        * bundle output path is set to `./www`

  -x, --platform    set --content-base of dev-server to a Cordova platform (ios,android).
        platform defaults to: ios (if found), android (if found), 'dist'

        ios:     --content-base=./platform/ios/www
        android: --content-base=./platform/android/assets/www

```

---

###Installation

```bash
npm install -g webpack webpack-dev-server # First install webpack
git clone https://github.com/Vertice/famous-webpack-seed
# rm -rf .git # optionally remove git history
npm install # install dependencies
```

---

###Development
Run the dev server with ```webpack-dev-server```

Go to the dev server url : ```http://localhost:8080/webpack-dev-server/boilerplate```. This is live-reloaded with an iframe.

Use ```webpack-dev-server --sync```, to add the live-reload snippet to the default build. Now you have live-reload without the iframe at ```http://localhost:8080/boilerplate```. You can optionally specify the IP address of the host computer: `--sync=192.168.0.1`.

---

###Production
Build the deployable static assets with ```webpack --minify```


(Note/todo: webpack also provides a `-p` option, but this mangles output. Not sure how to modify UglifyJS options when using the `-p` option)

---

###Cordova 

####Install:
```bash
npm install -g cordova
cordova platform add ios # or android
```

####Production:
```bash
webpack --minify --cordova
cordova run ios # or android
```

The `--cordova[=xxx.html]` command:

* updates `./config.xml` version to `package.json` version
* sets the entry-point in `./config.xml` to `xxx.html` (default: `index.html`)
* outputs bundle to the `./www` folder instead of the `./dist` folder.

####Development:
```bash
webpack-dev-server --sync=192.168.0.1 --cordova --platform=ios
webpack-dev-server --sync=192.168.0.1 --cordova --content-base=platform/ios/www #alternative
```

* `--sync=192.168.0.1` adds the live-reload snippet to web-dev-server (optional)
* `--cordova=boilerplate` sets the entry-point in `./config.xml` to `http://192.168.0.1:8080/boilerplate` 
* `--platform=ios` sets the `--content-base` to `/platforms/ios/www` (ios) or `/platforms/android/assets/www` (android). This is required for Cordova to work correctly. (The cordova javascript differs per platform and is located in those folders)

**Gotcha 1:** The `--platform=ios` option only works with [my fork](https://github.com/markmarijnissen/webpack-dev-server) of `webpack-dev-server`. I've submitted a [pull-request](https://github.com/webpack/webpack-dev-server/pull/41). You can always use `--content-base=platform/ios/www` or `--content-base=platform/android/assets/www` directly.

**Gotcha 2:** The magic HTML from webpack does not include `cordova.js`, so `http://192.168.0.1:8080/boilerplate` does not load cordova. 

To include `cordova.js`:

* Create a custom html which includes `<script type="text/javascript" src="cordova.js"></script>`. 
* Use `require('file?name=index.html!./index.html');` to copy your `index.html` from your `src` folder to the output bundle. 

This is how the boilerplate app loads cordova. Of course, you can change `index.html` to be whatever you like. Just use `--cordova=xxx.html` to set your entry-point in the `./config.xml`.

## Contributors

Like it? Show some love and star this project!

* Based on the original seed from [Adrian Rossouw](https://github.com/Vertice/famous-webpack-seed)
* Bugfix from [Tony Alves](https://github.com/talves/)