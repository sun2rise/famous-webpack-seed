#Famous-Webpack-Seed
> A seed project to get started with Webpack and Famo.us

###Features

* Multiple bundles: Every directory in `./src/` is bundled as an app.
* Require Jade (`.jade`), LESS (`.less`) and Coffee (`.coffee`)
* Use `--sync[=192.168.0.1]` to use the webpack-dev-server without the iframe! 
* Use `--target=xxx` to set a global TARGET variable (useful for multiple configurations)
* Use `--minify` to minify the bundle (without mangle)
* Use `--app=zzz` to only build a single directory (e.g. `--app=boilerplate` builds `./src/boilerplate/main.js`)

See also `webpack --extra-options` for help.

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

When using ```webpack-dev-server --sync```, the normal build (```http://localhost:8080/boilerplate```) will also live reload (without iframe). You can optionally specify the IP address of the host computer: `--sync=192.168.0.1`.

---

###Production
Build the deployable static assets with ```webpack --minify```

(Note/todo: webpack also provides a `-p` option, but this mangles output. Not sure how to modify UglifyJS options when using the `-p` option)

---

###Cordova 

Install:
```bash
npm install -g cordova
cordova platform add ios # or android

Run production:
```bash
webpack --cordova
cordova run ios
````

Run debug:
```bash
webpack --sync=192.168.0.1 --cordova=boilerplate
```

Sets the url in `config.xml` to `http://192.168.0.1:8080/boilerplate`, which is location of the (live-reloaded) boilerplate bundle.

**Todo:** Support for Cordova plugins when live reloading.

`cordova.js` and plugin js files are located in `/platforms/ios/www` or `/platforms/android/assets/www`, so server should run and reload from there.