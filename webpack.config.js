var webpack = require('webpack');
var path = require('path');

var options = getOptions();

var config = {
  "context": path.join(__dirname,'src'),
  "output":{
    path: path.join(__dirname,'dist'),
    filename:"[name].js"
  },
  "entry":options.entries,
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

function getOptions(){
  opt = require('optimist')
    .alias('a','app')
    .alias('t','target')
    .default('t','dev')
    .alias('m','minify')
    .default('m',false)
    .alias('o','extra-options')
    .alias('s','sync')
    .alias('c','cordova')
    .default('s',false)
    .argv;

  if(opt.o){
    console.log(
      "Webpack builds every 'main.js' in /src/[bundle]/\n"+
      "Every directory in /src/ is bundled as a seperate app.\n\n"+
      "Extra options:\n"+
      "\t-s, --sync[=ip]\t\tadds webpack-dev-server snippet to normal build.\n"+
      "\t-t, --target=xxx\tset a global TARGET variable (default: 'dev')\n"+
      "\t-m, --minify\t\tminify (without mangle) (default: false)\n"+
      "\t-a, --app=xxx\t\tbuild a single folder (default: all)\n"+
      "\t-c, --cordova\t\tmodify Cordova' ./config.xml (version and source url) and build to ./www"
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

  if(opt.c){
    var src = typeof opt.c === "string"? opt.c: "index.html";
    if(opt.s){
      src = "http://" + syncIP + ":8080/" + src;
    }
    var replace = require('replace');
    replace({
      regex: /version=\"([0-9]+\.?){1,3}\"/,
      replacement: "version=\""+require('./package.json').version+"\"",
      paths: ['config.xml'],
      silent: true
    });
    replace({
      regex: /<content +src="[^"]+\" *\/>/,
      replacement: "<content src=\""+src+"\"/>",
      paths: ['config.xml'],
      silent: true
    });
    console.log('Cordova:'+src);
  }

  opt.entries = entries;
  console.log('TARGET='+opt.t+' APP='+(opt.a?opt.a:'all')+' SYNC='+opt.s+' MINIFY='+opt.m);
  return opt;
}