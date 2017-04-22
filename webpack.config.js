'use strict';

const fs = require('fs'),
      path = require('path'),
      nopt = require('nopt'),
      webpack = require('webpack'),
      strip = require('strip-loader');

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
  path: path.resolve('./src/client/dist/js'),
  filename: '[name].bundle.js',
  publicPath: '/js/'
};

/**
 * watch: Boolean
 * Configure whether or not to watch. Can be sent in on cli or require.
 * Being set by gulp right now.
 */
//config.watch = true;

/**
 * devtool: Technique for creating sourcemaps.
 */
config.devtool = 'inline-source-map';

/**
 * stats: string|object
 * The stats option lets you precisely control what bundle information gets
 * displayed. This can be a nice middle ground if you don't want to use quiet or
 * noInfo because you want some bundle information, but not all of it.
 */
config.stats = {
  chunks: false,
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
  extensions: ['.ts', '.js']
};

/**
 * module: Object
 * Rules for how to process different modules. Can call loaders.
 */
config.module = { rules: [] };

// Compile *.ts files
config.module.rules.push({
  test: /\.ts$/,
  loaders: [
    {
      loader: 'awesome-typescript-loader',
      options: {
        silent: true
      }
    },
    'angular-router-loader'
  ]
});

if (options.prod) {
  // Strip console logging for production.
  config.module.rules.push({
    test: /\.ts$/,
    loader: strip.loader('console.log', 'console.error')
  });
}

// Handle SASS transpiling
config.module.rules.push({
  test: /\.scss$/,
  use: [ 'raw-loader', 'sass-loader' ]
});

// Handle pug transpiling
config.module.rules.push({
  test: /\.pug$/,
  loader: 'pug-loader'
});

// Embed files
config.module.rules.push({
  test: /\.html$/,
  loader: 'raw-loader',
});

// Create source maps
config.module.rules.push({
  // All output js files will have sourcemaps re-processed by source-map-loader
  enforce: 'pre',
  test: /\.js$/,
  loader: 'source-map-loader'
});

/**
 * externals: Object
 * Do not follow/bundle these values when imported/required. Instead, use the
 * mapping and assume there will be an object in the global space with the
 * value's name.
 *
 * This stops us from bundling our dependencies into our own code.
 */
config.externals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/compiler': 'ng.compiler',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/forms': 'ng.forms',
  '@angular/http': 'ng.http',
  '@angular/router': 'ng.router',
  'zone': 'Zone',
  'rxjs': 'Rx'
};

/**
 * plugins: [Object]
 * Plugins to modify the behavior of webpack.
 */
config.plugins = [];

if (options.prod) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: true }
  }));
}
