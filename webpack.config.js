var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var options = getExtraOptions({
  app: null,        // app folder to build (/src/[app]). null = all folders
  target: 'dev',    // set global TARGET variable (window.TARGET='dev')
  minify: false,    // minify bundle
  sync: false,      // add live-reload webpack-dev-server snippet to bundle
  cordova: 'index.html', // cordova entry-point (in ./config.xml)
  platform: null,   // "android" or "ios"
});

var config = {
  "context": path.join(__dirname,'src'),
  "output":{
    path: path.join(__dirname,'dist'),
    filename:"[name].js"
  },
  "externals":[
    /^(\.\/)?cordova(\.js)?$/
  ],
  "entry":options.entries,
  "devServer":{
    "colors":true,
    "contentBase":options.contentBase
  },
  "module":{
    "loaders":[
      { test: /\.json$/,   loader: "json-loader" },
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.css$/,    loader: "style-loader!css-loader" },
      { test: /\.less$/,   loader: "style-loader!css-loader!less-loader" },
      { test: /\.jade$/,   loader: "jade-loader" },
      { test: /\.(png|jpg|gif)$/,    loader: "url-loader?limit=5000" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" },
      { test: /const(ants)?\.js$/, loader: "expose?CONST" },
      { test: /^(\.\/)?cordova(\.js)?$/, loader: 'script-loader'}
      
    ]
  },
  "plugins":[
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
      TARGET: JSON.stringify(options.t)
    })
  ]
};

if(options.m){
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle:false}));
}
if(options.c){
  config.output.path = path.join(__dirname,'www');
}

module.exports = config;

function getExtraOptions(defaults){
  var opt = require('optimist')
    .alias('a','app')
    .alias('t','target')
    .alias('m','minify')
    .alias('o','extra-options')
    .alias('s','sync')
    .alias('c','cordova')
    .alias('x','platform')
    .argv;

  if(!opt.a) opt.a = defaults.app;
  if(!opt.t) opt.t = defaults.target;
  if(!opt.m) opt.m = defaults.minify;
  if(!opt.s) opt.s = defaults.sync;
  if(!opt.c) opt.c = defaults.cordova;
  if(!opt.platform) opt.platform = defaults.platform;

  if(opt.o){
    console.log(
      "Webpack builds every 'main.js' in /src/[bundle]/ to ./dist\n"+
      "Every directory in /src/ is bundled as a seperate app.\n\n"+
      "Extra options:\n"+
      "\t-s, --sync[=ip]\t\tadds webpack-dev-server live-reload snippet to the bundle(s).\n"+
      "\t-t, --target=xxx\tset a global TARGET variable (default: window.TARGET='dev')\n"+
      "\t-m, --minify\t\tminify without mangle (default: false)\n"+
      "\t-a, --app=xxx\t\tbuild a single src folder (default: all)\n\n"+
      "\t-c, --cordova=xxx\tmodify Cordova's ./config.xml\n"+
      "\t\t\t\t<config src=\"...\"/> is updated to 'xxx' (default: app (if specified), index.html)\n"+
      "\t\t\t\tversion is updated to version from package.json\n\n"+
      "\t-x, --platform\t\tset --content-base of dev-server to a Cordova platform (ios,android).\n"+
      "\t\t\t\tplatform defaults to: ios (if found), android (if found), 'dist'\n\n"+
      "\t\t\t\tios:     --content-base=./platform/ios/www\n"+
      "\t\t\t\tandroid: --content-base=./platform/android/assets/www\n\n"+
      "Example cordova development:\n"+
      "\twebpack-dev-server --sync --cordova=boilerplate --platform=ios\n\n"+
      "Example web development w/ live-reload:\n"+
      "\twebpack-dev-server --sync\n\n"+
      "Example cordova production build:\n"+
      "\twebpack --minify --cordova --target=app && cordova build ios\n\n"+
      "Example web production build:\n"+
      "\twebpack --minify --target=production --output-path=deploy\n"
      );
     process.exit();
  }

  var apps;
  if(opt.a) {
    apps = ['src/'+opt.a+'/main.js'];
  } else {
    apps = require('glob').sync(path.join('src','!(node_modules)','main.js'));
  }

  var syncIP = opt.s === true? require('ip').address():opt.s;
  var sync = "webpack-dev-server/client?http://"+syncIP+":8080/";

  var entries = {};
  apps.forEach(function(app){
    // voodoo magic
    var entry = "./" + app.substr(4,app.length-7);
    var name = entry.substr(2,entry.length-7).replace(/(\/|\\)/g,'-');
    // app = ./src/app/main
    entries[name] = opt.s? [sync , entry] :[entry];
  });

  /**
   * Cordova options
   *
   * Sets entry point for cordova.
   * Also updates Cordova' version with your package.json version.
   * 
   */
  if(opt.c){
    var src = "index.html";                // default is index.html
    if(opt.s && opt.a) src = opt.a;        // if syncing & app specified, default to that bundle
    if(typeof opt.c === "string") src = opt.c; // if cordova explicitly set, use that.

    if(opt.s){
      src = "http://" + syncIP + ":8080/" + src; // point to webpack-dev-server
    }
    var replace = require('replace');
    // replace version with version from package.json
    replace({
      regex: /version=\"([0-9]+\.?){1,3}\"/,
      replacement: "version=\""+require('./package.json').version+"\"",
      paths: ['config.xml'],
      silent: true
    });
    // replace entry point in config.xml
    replace({
      regex: /<content +src="[^"]+\" *\/>/,
      replacement: "<content src=\""+src+"\"/>",
      paths: ['config.xml'],
      silent: true
    });
    console.log('CORDOVA='+src);
  }

  /**
   * Cordova platform options
   *
   * Cordova has specific javascript for each platform.
   *
   * For the `webpack-dev-server` to correctly function, we need
   * to serve content from the correct platform specific directory.
   */
  opt.contentBase = "dist";
  var iosPath = path.join(__dirname,'platforms','ios','www');
  var androidPath = path.join(__dirname,'platforms','android','assets','www');
  if(opt.platform === "ios" || (!opt.platform && opt.c && fs.existsSync(iosPath))){
    opt.contentBase = iosPath;
  } else if(opt.platform === "android" || (!opt.platform && opt.c && fs.existsSync(androidPath))){
    opt.contentBase = androidPath;
  }

  opt.entries = entries;

  console.log('TARGET='+opt.t+' APP='+(opt.a?opt.a:'all')+' SYNC='+(opt.s?syncIP:false)+' MINIFY='+opt.m);
  return opt;
}