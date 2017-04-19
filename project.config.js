'use strict';

let config = module.exports = {
  paths: {},
  options: {},
  helpers: {}
};

config.paths = {
  root: './',
  dist: './src/client/dist/',
  tmp: './.tmp/',
  client: {
    dir: './src/client/',
    ts: './src/client/**/*.ts',
    static: './src/client/static/',
    sass: './src/client/sass/**/*.scss',
    app: {
      ts: './src/client/app/**/*.ts',
      main: './src/client/app/main.ts',
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
      DEBUG: 'creation'
    },
    watch: [config.paths.server.dir],
    ignore: [config.paths.client.dir]
  },
  browserSync: {
    proxy: 'localhost:' + config.options.port,
    port: config.options.port + 1,
    files: [
      config.paths.dist + '**/*',
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
    logLevel: 'debug',
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


