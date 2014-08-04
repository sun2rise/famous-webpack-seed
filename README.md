#Famous-Webpack-Seed
> A seed project to get started with Webpack and Famo.us. With support for Cordova!

###Features

* Split your app into multiple bundles. 

    ```./src/[bundle]/main.js ---> ./dist/[bundle]/bundle.js```
      
* Boilerplate bundle included for a quick start!
* Require Jade, LESS and Coffee.
* Support for **Cordova/Phonegap**.

See `webpack --extra-options` for help.

---

### Getting started with Famo.us and webpack

####Installation

```bash
# First install webpack
npm install -g webpack webpack-dev-server 

# clone this repository
git clone https://github.com/markmarijnissen/famous-webpack-seed

# optionally remove git history
# rm -rf .git 

# install dependencies
npm install 
```

####Development

```bash
webpack-dev-server --sync
```

Now navigate to:

* [http://localhost:8080/boilerplate](http://localhost:8080/boilerplate)
* [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server) (lists all content)

The optional `--sync[=ip]` flag:

* Adds the live-reload snippet to your bundle(s). You can optionally specify the IP address of the host computer: `--sync=192.168.0.1`. 

Without the `--sync` flag you can visit a live-reloaded iframe at http://localhost:8080/webpack-dev-server/boilerplate/bundle


####Production
```bash
webpack --minify --target=production
```

The optional `--minify` flag:

* Minifies the output.

The optional `--target=xxx` flag:

* Set a global TARGET variable (default: `window.TARGET='dev'`).

---

### Getting started with Cordova 

####Installation:

```bash
npm install -g cordova
cordova platform add ios # or android
```

####Development:

```bash
# shortcut
webpack-dev-server --sync=192.168.0.1 --cordova --platform=ios # or android

# long version
webpack-dev-server --sync=192.168.0.1 --cordova --content-base=platform/ios/www 
webpack-dev-server --sync=192.168.0.1 --cordova --content-base=platform/android/assets/www 
```

The `--platform=ios` flag:

* Set the correct **content-base** of webpack-dev-server. This is required for Cordova to load the correct (platform-dependant) javascript.


####Production:
```bash
webpack --minify --cordova --bundle=boilerplate
cordova run ios # or android
```

The `--cordova[=xxx.html]` flag:

* Cordova entry-point in `./config.xml` is updated to `xxx.html` (default: index.html)
* Version is updated to version from package.json
* Output path is set to `./www`

The `--bundle=xxx` flag:

* Builds a single bundle only.

---

### Troubleshooting

#### webpack-dev-server does not load Cordova correctly.

1. Try setting the `--content-base` manually (see above).

  The --platform=ios option only works with [my fork](https://github.com/markmarijnissen/webpack-dev-server) of webpack-dev-server. I've submitted a [pull-request](https://github.com/webpack/webpack-dev-server/pull/41). 

2. Check if `Cordova.js` is included. It is **not** included in the magic HTML from webpack-dev-server. To solve this:

    1. Create an `index.html` which includes 
        ````html
        <script type="text/javascript" src="cordova.js"></script>
        ````

    2. Now, in your `main.js`, require the index.html:
        ````js
        require('./index.html');
        ````
        
    3. Run webpack-dev-server and point to the correct `index.html`:
        ````
        webpack-dev-server --sync --cordova=[YOUR_BUNDLE_NAME]/index.html
        ````
        
        You can check `./config.xml` to make sure cordova loads the correct `index.html`

---

### Tips & Tricks

#### Different configuration for "dev" and "production" builds:
Use `--target=xxx` to maintain different configuration for development and production builds:

```javascript
if(TARGET === 'dev'){
   var api_url = "http://localhost:8080/api";
} else {
   var api_url = "http://www.myapi.com/api";
}
```

#### Cordova app + back-end app:
My projects often consist of two apps:

```bash
# A cordova app
./src/app/main.js   

# A back-end (dashboard, api, content editor)
./src/admin/main.js  
```   

Now you can do:
```bash
# output all bundles to `./dist` to upload online.
webpack                 

# output only 'app' bundle to `./www` for cordova.
webpack --cordova --bundle=app    
```
---

## Contributors

Like it? Show some love and star this project!

* Based on the original seed from [Adrian Rossouw](https://github.com/Vertice/famous-webpack-seed)
* Bugfix from [Tony Alves](https://github.com/talves/)

## Changelog

**0.5.0**

* renamed `--app` flag to `--bundle`
* added changelog

**0.4.0**

* use `copy-loader` and `copy-url-loader` to create independent bundles.