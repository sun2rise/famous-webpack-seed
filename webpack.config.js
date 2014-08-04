var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var options = getExtraOptions({
  bundle: null,     // folder to build (/src/[bundle]). null = all folders
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
    filename:"[name]/bundle.js",
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
      { test: /\.(png|jpg|gif)$/,    loader: "copy-url-loader?limit=5000" },
      { test: /\.eot$/,    loader: "copy-loader" },
      { test: /\.ttf$/,    loader: "copy-loader" },
      { test: /\.svg$/,    loader: "copy-loader" },
      { test: /index\.html$/,    loader: "copy-loader" },
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
if(options.cordova){
  config.output.path = path.join(__dirname,'www');
  if(options.b) {
    config.copyContext = path.join(__dirname,'src',options.b);
    config.output.filename = 'bundle.js';
  }
}

module.exports = config;

function getExtraOptions(defaults){
  var opt = require('optimist')
    .alias('b','bundle')
    .alias('t','target')
    .alias('m','minify')
    .alias('o','extra-options')
    .alias('s','sync')
    .alias('x','platform')
    .argv;

  if(!opt.b) opt.b = defaults.bundle;
  if(!opt.t) opt.t = defaults.target;
  if(!opt.m) opt.m = defaults.minify;
  if(!opt.s) opt.s = defaults.sync;
  if(opt.cordova === true) opt.cordova = defaults.cordova;
  if(!opt.platform) opt.platform = defaults.platform;

  if(opt.o){
    console.log(
      "Webpack builds every 'main.js' in /src/[bundle]/ to ./dist/[bundle].\n\n"+
      "Extra options:\n"+
      "\t-s, --sync[=ip]\t\tAdds webpack-dev-server live-reload snippet to the bundle(s).\n"+
      "\t-t, --target=xxx\tSet a global TARGET variable (default: window.TARGET='dev')\n"+
      "\t-m, --minify\t\tMinify without mangle (default: false)\n"+
      "\t-b, --bundle=xxx\tBuild a single bundle (default: all)\n\n"+
      "\t    --cordova=xxx\tModify Cordova's ./config.xml\n\n"+
      "\t\t\t\t* Cordova entry-point is updated to 'xxx' (default: index.html)\n"+
      "\t\t\t\t* Version is updated to version from package.json\n"+
      "\t\t\t\t* Output path is set to `./www`\n\n"+
      "\t-x, --platform\t\tSet correct content-base for webpack-dev-server.\n"+
      "\t\t\t\tDefault: ios (if found), android (if found), 'dist'\n\n"+
      "\t\t\t\t* ios:     --content-base=./platform/ios/www\n"+
      "\t\t\t\t* android: --content-base=./platform/android/assets/www\n\n"+
      "Cordova examples:\n"+
      "\twebpack-dev-server --sync --cordova=boilerplate/index.html --platform=ios\n"+
      "\twebpack --minify --cordova --bundle=boilerplate   && cordova build ios (build single bundle)\n"+
      "\twebpack --minify --cordova=boilerplate/index.html && cordova build ios (build all bundles, start at boilerplate)\n"+
      
      "\nWeb examples:\n"+
      "\twebpack-dev-server --sync\n"+
      "\twebpack --minify --target=production\n"
      );
     process.exit();
  }

  var apps;
  if(opt.b) {
    apps = ['src/'+opt.b+'/main.js'];
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
  if(opt.cordova){
    var src = opt.cordova; // if cordova explicitly set, use that.

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
  if(opt.platform === "ios" || (!opt.platform && opt.cordova && fs.existsSync(iosPath))){
    opt.contentBase = iosPath;
  } else if(opt.platform === "android" || (!opt.platform && opt.cordova && fs.existsSync(androidPath))){
    opt.contentBase = androidPath;
  }

  opt.entries = entries;

  console.log('TARGET='+opt.t+' BUNDLE='+(opt.b?opt.b:'all')+' SYNC='+(opt.s?syncIP:false)+' MINIFY='+opt.m);
  return opt;
}