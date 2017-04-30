'use strict';

const nopt = require('nopt');

let options = nopt({ prod: Boolean }, {});

options.prod = options.prod || process.env.NODE_ENV === 'production';

let config = module.exports = {
  paths: {},
  options: {},
  helpers: {},
  vendors: []
};

config.paths = {
  root: './',
  dist: './src/client/dist/',
  tmp: './.tmp/',
  client: {
    dir: './src/client/',
    ts: [
      './src/client/**/*.ts',
      '!**/*.spec.ts'
    ],
    static: './src/client/static/',
    sass: './src/client/sass/**/*.scss',
    app: {
      dir: './src/client/app/',
      ts: './src/client/app/**/*.ts',
      main: options.prod ?
        './src/client/app/prod.ts' :
        './src/client/app/dev.ts',
      source: [
        '!./src/client/app/**/*.spec.ts',
        './src/client/app/**/*.ts',
      ],
      tests: './src/client/app/**/*.spec.ts',
      template: './src/views/index.pug',
      bundle: './src/client/dist/js/bundle.js'
    }
  },
  server: {
    dir: './src/',
    entry: './src/index.ts',
    js: [
      './src/**/*.js',
      '!./src/client/**/*'
    ],
    pug: './src/views/**/*.pug'
  },
  source: './src/',
  all: {
    ts: './src/**/*.ts'
  }
};

config.options.port = 3000;
config.options = {
  nodemon: {
    ext: 'js',
    verbose: false,
    env: {
      PORT: config.options.port,
      NODE_ENV: 'dev',
      DEBUG: 'creation:*'
    },
    watch: [config.paths.server.dir],
    ignore: [config.paths.client.dir]
  },
  browserSync: {
    proxy: 'localhost:' + config.options.port,
    port: config.options.port + 1,
    files: [
      config.paths.dist + 'js/**/*.js',
      config.paths.dist + 'css/**/*.css',
      config.paths.server.pug
    ],
    ghostMode: {
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info',
    logPrefix: 'browser-sync',
    notify: true
  }
};

config.helpers = {
  /** Returns an array of globs for known static files in a given directory.
   */
  staticFilesIn: dir => {
    return [
      // Fonts
      dir + '**/*.otf',
      dir + '**/*.eot',
      dir + '**/*.ttf',
      dir + '**/*.woff',
      dir + '**/*.svg',

      // Images
      dir + '**/*.png',
      dir + '**/*.jpg',
      dir + '**/*.gif'
    ];
  },
  port: newPort => {
    config.options.port = newPort;
    config.options.nodemon.env.PORT = newPort;
    config.options.browserSync.proxy = 'localhost:' + newPort;
    config.options.browserSync.port = newPort + 1;
  }
};

config.vendors = [
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/core',
  '@angular/common',
  '@angular/http',
  '@angular/router',
  '@angular/forms',
  '@angular/compiler',
  'core-js',
  'zone.js',
  'rxjs'
];
