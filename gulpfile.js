'use strict';

// TODO: Make browser-sync stop reloading on deleted files.
// TODO: Add jscs tasks to linting

const gulp = require('gulp-help')(require('gulp'), {
        hideEmpty: true,
        aliases: [
          'tasks'
        ],
        hideDepsMessage: true
      }),
      inspect = require('util').inspect,
      fs = require('fs'),
      path = require('path'),
      nopt = require('nopt'),
      through = require('through2'),
      del = require('del'),
      webpack = require('webpack'),
      browserSync = require('browser-sync').create(),
      karma = require('karma'),
      plugins = require('gulp-load-plugins')({ lazy: true });

let userConfig = fs.existsSync('./user.config.js'),
    config = userConfig ?
      require('./user.config.js') :
      require('./project.config.js'),
    webpackConfig = require('./webpack.config.js'),
    webpackCompiler = webpack(webpackConfig),
    colors = plugins.util.colors;

// =============================================================================
// Option parsing
// =============================================================================
let possibleOptions = {
  'verbose': Boolean, // For verbose logging from most tasks
  'watch': Boolean, // To watch any task that supports it.
};

let shorthandOptions = { };

let options = nopt(possibleOptions, shorthandOptions, process.argv);

function defaultOptionValue(key, value) {
  if (!(key in options)) {
    options[key] = value;
  }
}

let task = options.argv.cooked.find(option => !option.startsWith('-')) || 'default';

if (task === 'default' || task === 'dev') {
  defaultOptionValue('watch', true);
  defaultOptionValue('verbose', true);
}

webpackConfig.watch = options.watch;

// =============================================================================
// Utility functions.
// =============================================================================
/**
 * Logs in the gulp fashion, with timestamp and colors. Relys on gulp-util.
 *
 * @param {string} message - The message to output.
 */
function log(message) {
  if (typeof message === 'object') {
    plugins.util.log(colors.cyan(inspect(message, { depth: 8 })));
    return;
  }

  plugins.util.log(message);
}

/**
 * Log a message only if the --verbose flag was sent in. Exists for readability
 *
 * @param {string} message - The message to output.
 */
function logVerbose(message) {
  if (options.verbose) {
    log(message);
  }
}

/**
 * No-op. A function that does nothing for when you need one for gulp-help.
 */
function noop() {}

/**
 * Using the del module, this function will delete the paths given and log what
 * was deleted.
 *
 * @param {(string|string[])} paths - Glob(s) of paths to source.
 * @param {function} [done] - Gulp callback to indicate completion.
 */
function clean(paths, done) {
  return del(paths).then(paths => {
    if (paths.length) {
      logVerbose('Deleted files/folders:\n' + colors.magenta(paths.join('\n')));
    } else {
      logVerbose('No files to delete.');
    }

    if (done) {
      done();
    }
  });
}

/**
 * Returns a stream function that can be piped to, which will output each file
 * going through the stream if the verbose flag was sent in. If a task name is
 * given, then file names are prepended with that.
 *
 * @param {string} [task] - Task name to append file paths with.
 */
function printVerbose(task) {
  let printer;
  if (task) {
    printer = function(filepath) {
      return `${colors.yellow(task)}: ${colors.magenta(filepath)}`;
    };
  }

  return plugins.if(options.verbose, plugins.print(printer));
}

/**
 * Replacement for gulp.src that will either return back a normally sourced
 * path or a watched path using gulp-watch. gulp-watch will send changed files
 * through a stream instead of rerunning an entire task on all files it might
 * match, so is much more performant than gulp.watch.
 *
 * @param {(string|string[])} paths - Glob(s) of paths to source.
 * @param {Object} [opts] - Options to pass to gulp.src/gulp-watch.
 * @param {function} [callback] - Callback to handle piping on sources. Use when plugin relies on end/flush event.
 */
function source(paths, opts, callback) {
  if (typeof opts === 'function') { callback = opts; }
  opts = typeof opts === 'object' ? opts : {};
  opts = Object.assign({ ignoreInitial: false }, opts);

  if (callback) {
    let wrapCallback = () => {
      let sources = gulp.src(paths, opts);
      callback(sources);
    };
    if (options.watch) {
      return plugins.watch(paths, opts, wrapCallback);
    }

    return wrapCallback();
  }

  return options.watch ?
    plugins.watch(paths, opts) :
    gulp.src(paths, opts);
}

function tslint(paths, config, taskName) {
  return source(paths)
    .pipe(printVerbose(taskName))
    .pipe(plugins.tslint({
      configuration: config,
      formatter: 'prose'
    }))
    .pipe(through.obj(function accumulateFailures(file, enc, done) {
      this.push(file);

      // If the task is being watched, the end will never fire to log out from
      // and the user will never get a "You fixed your errors" confirmation.
      // So if it's a watch and the file is clean, log out such. The add event
      // is skipped cause every file throws an add event as watch first sees it
      // and new files are generally somewhat empty.
      if (options.watch &&
        (file.tslint && file.tslint.failures && !file.tslint.failures.length) &&
        file.event !== 'add') {
        let path = file.path.substr(file.cwd.length);

        log(colors.green('tslint: ') + colors.cyan(path));
      }
      done();
    }))
    .pipe(plugins.tslint.report({
      emitError: true,
      reportLimit: 0,
      summarizeFailureOutput: true
    }));
}

// =============================================================================
// Tasks - Build
// =============================================================================
gulp.task('build',
  'Build the client site into ./src/client/dist/',
  ['build:webpack', 'build:static', 'build:sass']);

gulp.task('build:webpack', done => {
  if (options.watch) {
    webpackCompiler.watch({}, (err, stats) => {
      log(stats.toString({
        chunks: false,
        colors: true
      }));
    });
  } else {
    webpackCompiler.run((err, stats) => {
      log(stats.toString({
        chunks: false,
        colors: true
      }));
    });
  }
  done();
});

gulp.task('build:static', ['clean:static'], () => {
  return source(config.helpers.staticFilesIn(config.paths.client.static))
    .pipe(printVerbose('build:static - write'))
    .pipe(gulp.dest(config.paths.dist));
});

// For site-wide styles. Don't use for angular component styles. Require
// those in.
gulp.task('build:sass', ['clean:css'], () => {
  return source(config.paths.client.sass)
    .pipe(printVerbose('build:sass - read'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.paths.dist + 'css/'))
    .pipe(printVerbose('build:sass - write'));
});

// =============================================================================
// Tasks - Cleaning files.
// =============================================================================
gulp.task('clean', done => {
  clean(config.paths.dist, done);
});

gulp.task('clean:static', done => {
  clean(config.helpers.staticFilesIn(config.paths.dist), done);
});

gulp.task('clean:css', done => {
  clean(config.paths.client.dist + 'css/**/*.css', done);
});

// =============================================================================
// Tasks - Code quality
// =============================================================================
gulp.task('lint',
  'Lint the server with jshint, and the client with tslint.',
  ['lint:jshint', 'lint:tslint', 'lint:tslint:spec']);

gulp.task('lint:jshint', () => {
  return source(config.paths.server.js)
    .pipe(printVerbose('lint:jshint'))
    .pipe(plugins.jshint())
    .pipe(through.obj(function accumulateFailures(file, enc, done) {
      this.push(file);

      // If the task is being watched, the end will never fire to log out from
      // and the user will never get a "You fixed your errors" confirmation.
      // So if it's a watch and the file is clean, log out such. The add event
      // is skipped cause every file throws an add event as watch first sees it
      // and new files are generally somewhat empty.
      if (options.watch &&
        (file && file.jshint && file.jshint.success) &&
        file.event !== 'add') {
        let path = file.path.substr(file.cwd.length);

        log(colors.green(`jshint: ${path}`));
      }
      done();
    }))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('lint:tslint', () => {
  return tslint(config.paths.client.app.source, './tslint.json', 'lint:tslint');
});

gulp.task('lint:tslint:spec', () => {
  return tslint(config.paths.client.app.tests, './tslint.spec.json', 'lint:tslint:spec');
});

// =============================================================================
// Tasks - Test
// =============================================================================
gulp.task('test', 'Runs the project\'s unit tests.', done => {
  let karmaConfig = karma.config.parseConfig(path.resolve('./karma.conf.js'), {
    singleRun: true
  });

  if (!options.watch) {
    return new karma.Server(karmaConfig, () => {
      log('Client tests ran.');
      done();
      process.exit();
    }).start();
  }

  karmaConfig.files.pop();

  gulp.watch('src/client/app/**/*.ts', (event) => {
    if (!event.path.endsWith('spec.ts')) {
      let searchMessage = colors.yellow('Looking for spec file for: ');
      searchMessage += colors.magenta(event.path.substr(process.cwd().length));
      logVerbose(searchMessage);

      let specPath = event.path.replace(/\.ts$/, '.spec.ts');
      if (!fs.existsSync(specPath)) {
        let bailMessage = colors.yellow('No spec file found for file: ');
        bailMessage += colors.magenta(event.path.substr(process.cwd().length));
        logVerbose(bailMessage);

        return;
      }
      event.path = specPath;
    }

    let logMessage = colors.yellow('Testing: ');
    logMessage += colors.magenta(event.path.substr(process.cwd().length));
    log(logMessage);
    karmaConfig.files.push(event.path);

    new karma.Server(karmaConfig, () => {
      karmaConfig.files.pop();
    }).start();
  });
});

// =============================================================================
// Tasks - Running
// =============================================================================
gulp.task('run', 'Runs the program using nodemon/browser-sync for auto-reloading.', () => {
  return plugins.nodemon(config.options.nodemon)
    .on('start', () => {
      if (browserSync.active) {
        return;
      }

      logVerbose('Nodemon starting.');
      browserSync.init(config.options.browserSync);
    })
    .on('restart', () => {
      logVerbose('Nodemon restarting.');
    });
});

// =============================================================================
// Tasks - Default
// =============================================================================
gulp.task('default',
  'Run, build, and lint the project with the watch & verbose flags.',
  ['build', 'run', 'test', 'lint'],
  noop,
  {
    aliases: ['dev']
  });

