var webpack = require('webpack');
var ReloadPlugin = require('webpack-reload-plugin');
var path = require('path');

// Support for extra commandline arguments
var argv = require('optimist')
            //--env=XXX: sets a global ENV variable (i.e. window.ENV="XXX")
            .alias('e','env').default('e','dev')
            //--minify:  minifies output
            .alias('m','minify')
            .argv;

var config = {
  entry:getEntries(), // every ./src/XXXX/main.js
  output:{
    path: './dist',
    filename:"[name]/bundle.js",
    publicPath: '../'
  },
  devServer: {
    publicPath: '/'
  },
  reload: isDevServer()? 'localhost': null,
  module:{
    loaders:[
      { test: /\.json$/,            loader: "json-loader" },
      { test: /\.coffee$/,          loader: "coffee-loader" },
      { test: /\.css$/,             loader: "style-loader!css-loader" },
      { test: /\.less$/,            loader: "style-loader!css-loader!less-loader" },
      { test: /\.jade$/,            loader: "jade-loader" },
      { test: /\.(png|jpg|gif)$/,   loader: "url-loader?limit=50000&name=[path][name].[ext]&context=./src" },
      { test: /\.eot$/,             loader: "file-loader?name=[path][name].[ext]&context=./src" },
      { test: /\.ttf$/,             loader: "file-loader?name=[path][name].[ext]&context=./src" },
      { test: /\.svg$/,             loader: "file-loader?name=[path][name].[ext]&context=./src" },
      { test: /index\.html$/,       loader: "file-loader?name=[path][name].[ext]&context=./src" },
      { test: /const(ants)?\.js$/,  loader: "expose?CONST" }
    ]
  },
  copyContext: 'src',
  plugins:[
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
      ENV: JSON.stringify(argv.env)
    }),
    new ReloadPlugin()
  ]
};

if(argv.minify){
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle:false}));
}

/**
 * Search for "/src/xxx/main.js" and return { xxx: './xxx/main' }
 */
function getEntries(){
  var apps = require('glob').sync(path.join('src','!(node_modules)','main.js'));
  var entries = {};
  apps.forEach(function(file){
    //                                             file =   src/boilerplate/main.js
    var entry = "./" + file.substr(0,file.length-3); // = ./src/boilerplate/main
    var name = entry.substr(6,entry.length-11);      // =       boilerplate
    entries[name] = entry;
  });
  return entries;
}

function isDevServer(){
  return process.argv.join('').indexOf('webpack-dev-server') > -1;
}

module.exports = config;


