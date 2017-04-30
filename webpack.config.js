'use strict';

const fs = require('fs'),
      path = require('path'),
      nopt = require('nopt'),
      webpack = require('webpack'),
      strip = require('strip-loader'),
      AotPlugin = require('@ngtools/webpack').AotPlugin,
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
  path: path.resolve('./src/client/dist/js'),
  filename: '[name].[chunkhash].bundle.js',
  publicPath: '/js/'
};

/**
 * devtool: Technique for creating sourcemaps.
 */
config.devtool = options.prod ?
  // Source map version that only maps errors and doesn't expose the map to the browser dev tools
  'hidden-source-map' :
  // This version creates the source map as a separate file
  'source-map';

// Use this version to have the source map as inline comment with the map in DataUrl
// config.devtool = 'inline-source-map';

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
  extensions: ['.ts', '.js']
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
    test: /\.ts$/,
    loader: strip.loader('console.log', 'console.error')
  });

  rules.push({
    test: /\.ts/,
    loader: '@ngtools/webpack'
  });
} else {
  //Compile *.ts files
  config.module.rules.push({
    test: /\.ts$/,
    loaders: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          silent: true
        }
      },
      'angular2-template-loader'
      // Our AOT build doesn't allow for lazy loading yet. Figure out how to make it work.
      // 'angular-router-loader'
    ]
  });
}

// Handle SASS transpiling
rules.push({
  test: /\.scss$/,
  use: [ 'raw-loader', 'sass-loader' ]
});

// Handle pug transpiling
rules.push({
  test: /\.pug$/,
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

// Embed files
rules.push({
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
      options: {
        minimize: false
      }
    }
  ]
});

// Create source maps
rules.push({
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
config.externals = {};

/**
 * externals: Object
 * Do not follow/bundle these values when imported/required. Instead, use the
 * mapping and assume there will be an object in the global space with the
 * value's name.
 *
 * This stops us from bundling our dependencies into our own code.
 */
config.externals = options.prod ?
  {} :
  {
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
let plugins = config.plugins = [];

plugins.push(new webpack.optimize.UglifyJsPlugin({
  sourceMap: true,
  compress: { warnings: true }
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
  plugins.push(new AotPlugin({
    tsConfigPath: './tsconfig.aot.json',
    entryModule: path.resolve('./src/client/app/app.module#AppModule')
  }));

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
