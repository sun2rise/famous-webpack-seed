var webpack = require('webpack');
var ReloadPlugin = require('webpack-reload-plugin');
var path = require('path');
var isRunningDevServer = isDevServer();

// Support for extra commandline arguments
var argv = require('optimist')
            //--env=XXX: sets a global ENV variable (i.e. window.ENV="XXX")
            .alias('e','env').default('e','dev')
            //--minify:  minifies output
            .alias('m','minify')
            .argv;

      console.log(__dirname);
var config = {
  context: path.join(__dirname, "src"),
  entry: getEntries(), // every ./src/XXXX/main.js
  output:{
    path: path.join(__dirname, "dist"),
    filename:"[name]/js/bundle.js",
    publicPath: isRunningDevServer ? '/': ''
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
      { test: /\.(png|jpg|gif)$/,   loader: "url-loader?limit=50000" + assetParams() },
      { test: /\.eot$/,             loader: "file-loader" + assetParams() },
      { test: /\.ttf$/,             loader: "file-loader" + assetParams() },
      { test: /\.svg$/,             loader: "file-loader" + assetParams() },
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
  // Get all entry points of our application starting with the root
  // Our bundles will be placed in a relative path ./js
  var apps = require('glob').sync(path.join('./src/**/main.js'));
  var entries = {};
  apps.forEach(function(file){
    // Example file = src/boilerplate/main.js
    var entry = "./" + file.substr(4,file.length-7); // = ./boilerplate/main
    var partsOfFile = file.split('/'); // array of path parts
    var name = '';
    partsOfFile.forEach(function(part){ name += (part !== 'src' && part !== 'main.js') ? (name === '')?  part : '/' + part : ''});
    if (name === '') name = 'assets'; // [optional] setup for a root entry. point to assets/js/bundle.js in index.html
    entries[name] = entry;
  });
   return entries;
}

function isDevServer(){
  return process.argv.join('').indexOf('webpack-dev-server') > -1;
}

function assetParams() {
    // we want a relative path for our entry points, we will set the context in our sub directory images
    // see /boilerplate/main.js for an example.
    return isRunningDevServer? '?name=[path][name].[ext]&context=./src' : '?name=[path][name].[ext]';
    // if you want absolute paths for your entry points, change the output.publicPath value from '' to '/'
}

module.exports = config;


