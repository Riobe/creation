'use strict';

const fs = require('fs'),
      path = require('path'),
      nopt = require('nopt'),
      webpack = require('webpack'),
      strip = require('strip-loader'),
      HtmlWebpackPlugin = require('html-webpack-plugin');
      //BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = module.exports = {};

let userConfig = fs.existsSync('./user.config.js'),
    projectConfig = userConfig ?
      require('./user.config.js') :
      require('./project.config.js');

let options = nopt({ prod: Boolean }, {});

options.prod = options.prod || process.env.NODE_ENV === 'production';

/**
 * Entry: (String || [String])
 * Entry point to start bundling from.
 */
config.entry = {
  app: projectConfig.paths.client.app.main
};

/**
 * ouput: Object
 * Configure where the bundled file will be created.
 */
config.output = {
  path: path.resolve('./dist/js'),
  publicPath: 'js/'
};

config.output.filename = options.prod ?
  '[name].[chunkhash].bundle.js' :
  '[name].bundle.js';

/**
 * devtool: Technique for creating sourcemaps.
 */
config.devtool = 'source-map'; // This version creates the source map as a separate file

/**
 * stats: string|object
 * The stats option lets you precisely control what bundle information gets
 * displayed. This can be a nice middle ground if you don't want to use quiet or
 * noInfo because you want some bundle information, but not all of it.
 */
config.stats = {
  chunks: false,
  children: false,
  colors: true,
  maxModules: 0,
  version: false,
  modules: false,
  warnings: false
};

/**
 * resolve: Object
 * Rules for how import/require statements will find files.
 */
config.resolve = {
  // We're using webpack to bundle our client code, which is typescript, so
  // start with the ts extension.
  extensions: ['.js'],
  alias: {
    vue: 'vue/dist/vue.esm.js'
  }
};

/**
 * module: Object
 * Rules for how to process different modules. Can call loaders.
 */
config.module = { };
let rules = config.module.rules = [];

if (options.prod) {
  // Strip console logging for production.
  rules.push({
    test: /\.js$/,
    loader: strip.loader('console.log', 'console.error'),
    exclude: /(node_modules|spec\.js)/
  });
} 

// Handle pug transpiling
rules.push({
  test: /index\.pug$/,
  loaders: [
    {
      loader: 'apply-loader',
      options: {
        obj: {
          ENV: options.prod ? 'production' : 'development'
        }
      }
    },
    {
      loader: 'pug-loader',
      options: {
        globals: {
        }
      }
    }
  ]
});

rules.push({
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
});

rules.push({
  test: /\.vue$/,
  use: [
    {
      loader: 'vue-loader',
      options: {
        loaders: {
          scss: 'vue-style-loader!css-loader!sass-loader'
        }
      }
    }
  ]
});

//// Create source maps
//rules.push({
  //// All output js files will have sourcemaps re-processed by source-map-loader
  //enforce: 'pre',
  //test: /\.js$/,
  //loader: 'source-map-loader'
//});

/**
 * externals: Object
 * Do not follow/bundle these values when imported/required. Instead, use the
 * mapping and assume there will be an object in the global space with the
 * value's name.
 *
 * This stops us from bundling our dependencies into our own code.
 */
config.externals = {};

/**
 * plugins: [Object]
 * Plugins to modify the behavior of webpack.
 */
let plugins = config.plugins = [];

plugins.push(new webpack.optimize.UglifyJsPlugin({
  sourceMap: true,
  compress: { warnings: false }
}));

plugins.push(new HtmlWebpackPlugin({
  filename: '../index.html',
  template: projectConfig.paths.client.app.template
}));

plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor.[chunkhash].bundle.js',
  minChunks: module => {
    let context = module.context;
    return context && context.indexOf('node_modules') >= 0;
  }
}));

plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  minChunks: Infinity
}));

if (options.prod) {
  if (options.verbose) {
    plugins.push(new webpack.ProgressPlugin());
  }
}

/**
  * If you need to debug bundling, this bundle analyzer plugin
  * can be used to inspect the contents of the bundles.
  */
// config.plugins.push(
//   new BundleAnalyzerPlugin()
// );
