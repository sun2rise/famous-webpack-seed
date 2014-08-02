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

When using ```webpack-dev-server --sync```, the normal build (```http://localhost:8080/boilerplate```) will also live reload (without iframe).

---

###Production
Build the deployable static assets with ```webpack --minify```

(Note/todo: webpack also provides a `-p` option, but this mangles output. Not sure how to modify UglifyJS options when using the `-p` option)


