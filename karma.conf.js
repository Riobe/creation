'use strict';

const fs = require('fs'),
      webpackConfig = require('./webpack.config.js');

let projectConfig = fs.existsSync('./user.config.js') ?
      require('./user.config.js') :
      require('./project.config.js');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      // Angular 2 dependencies.
      'node_modules/core-js/client/shim.min.js',
      'node_modules/core-js/client/core.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/rxjs/bundles/Rx.js',

      // Zone
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/mocha-patch.js',

      // Angualr 2
      'node_modules/@angular/core/bundles/core.umd.js',
      'node_modules/@angular/common/bundles/common.umd.js',
      'node_modules/@angular/compiler/bundles/compiler.umd.js',
      'node_modules/@angular/router/bundles/router.umd.js',
      'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
      'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      // Forms and HTTP are reliant upon platform-browser already being loaded
      // have to be imported after it.
      'node_modules/@angular/forms/bundles/forms.umd.js',
      'node_modules/@angular/http/bundles/http.umd.js',

      // Our tests. Everything must be imported from here.
      projectConfig.paths.client.app.tests
    ],
    preprocessors: {
      'src/client/app/**/*.spec.ts': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: webpackConfig.stats,
      noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: 1,
    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      exitOnResourceError: true
    },
    client: {
      captureConsole: false
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/
      }
    }
  });
};
