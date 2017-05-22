'use strict';

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

// Use consistent colors everywhere, so pull out the ones we want.
let cWarning = colors.bold.yellow,
    cVerbose = colors.yellow,
    cSuccess = colors.green,
    cTask = colors.blue,
    cPath = colors.magenta,
    cValue = colors.cyan;

// =============================================================================
// Option parsing
// =============================================================================
let possibleOptions = {
  'build': Boolean, // Controls building in non-build tasks.
  'lint': Boolean, // Controls linting in non-lint tasks.
  'open': Boolean, // Used to open the app when running.
  'run': Boolean, // Controls running in non-run tasks.
  'silent': Boolean, // Suppress all logging
  'test': Boolean, // Controls testing in non-lint tasks.
  'verbose': Boolean, // To watch any task that supports it.
  'watch': Boolean, // To watch any task that supports it.
};

let shorthandOptions = {
  'B': ['--no-build'],
  'O': ['--no-open'],
  's': ['--silent'],
  'w': ['--watch'],
  'W': ['--no-watch'],
  // Cannot do this. Gulp itself eats the -v flag.
  // 'v': ['--verbose'],
  'V': ['--no-verbose']
};

let options = nopt(possibleOptions, shorthandOptions, process.argv);

function defaultOptionValue(key, value) {
  if (!(key in options)) {
    options[key] = value;
  }
}

let task = options.argv.cooked.find(option => !option.startsWith('-'));
task = task || 'default';

if (task === 'default' || task === 'dev') {
  defaultOptionValue('build', true);
  defaultOptionValue('open', true);
  defaultOptionValue('lint', true);
  defaultOptionValue('run', true);
  defaultOptionValue('test', true);
  defaultOptionValue('watch', true);
  defaultOptionValue('verbose', true);
}

if (task === 'run') {
  options.run = true;
  defaultOptionValue('build', false);
  defaultOptionValue('open', true);
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
    plugins.util.log(cValue(inspect(message, { depth: 8 })));
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
      logVerbose('Deleted files/folders:\n' + cPath(paths.join('\n')));
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
      return `${cTask(task)}: ${cPath(filepath)}`;
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
 * @param {function} [callback] - Callback to handle piping on sources.
 *                                Use when plugin relies on end/flush event.
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

/**
 * The examples in browser-sync all refer to using browserSync.active to
 * protect against init'ing browser-sync when it's already running. They don't,
 * however, handle calling init twice before the first call has finished. By
 * using memoization this function will protect itself against that.
 */
let initBrowserSync = (function() {
  let initializing = false;

  function init() {
    if (browserSync.active || initializing) {
      return;
    }

    initializing = true;

    let browserSyncConfig = config.options.browserSync;
    browserSyncConfig.open = options.open;

    // Workaround to handle browser-sync ignoring watchEvents
    // https://github.com/BrowserSync/browser-sync/issues/1367
    browserSyncConfig.files = browserSyncConfig.files.map(pattern => {
      return {
        match: pattern,
        fn: event => {
          if (!['add', 'change'].includes(event)) {
            return;
          }

          browserSync.reload();
        }
      };
    });

    browserSync.init(browserSyncConfig, () => {
      initializing = false;
    });
  }

  return init;
})();

// =============================================================================
// Tasks Functions
// =============================================================================

// Linting =====================================================================

/**
 * Lint the client typescript with tslint.
 */
function tslint(paths, config, taskName) {
  return () => {
    return source(paths, {ignoreInitial: options.watch})
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
        // is skipped cause every file throws an add event as watch first sees
        // it and new files are generally somewhat empty.
        if (options.watch &&
          (file.tslint &&
            file.tslint.failures &&
            !file.tslint.failures.length) &&
          file.event !== 'add') {
          let path = file.path.substr(file.cwd.length);

          log(cSuccess('tslint: ') + cPath(path));
        }
        done();
      }))
      .pipe(plugins.tslint.report({
        emitError: true,
        reportLimit: 0,
        summarizeFailureOutput: true
      }));
  };
}

/**
 * Lint the server side javascript with jshint.
 */
function jshint() {
  return source(config.paths.server.js, {ignoreInitial: options.watch})
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

        log(cSuccess('jshint: ') + cPath(path));
      }
      done();
    }))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
}

/**
 * Style check the server side javascript with jscs.
 */
function jscs() {
  return source(config.paths.server.js)
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter());
}

// Building ====================================================================

/**
 * Build using webpack.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function buildWebpack(done) {
  let callback = complete => {
    return (err, stats) => {
      log(stats.toString(webpackConfig.stats));
      if (options.open) { initBrowserSync(); }
      if (complete) { complete(); }
    };
  };

  if (options.watch) {
    webpackCompiler.watch({}, callback());
  } else {
    webpackCompiler.run(callback(done));
  }
}

/**
 * Copy static files into the dist/ directory.
 */
function buildStatic() {
  return source(config.helpers.staticFilesIn(config.paths.client.static))
    .pipe(printVerbose('build:static - write'))
    .pipe(gulp.dest(config.paths.dist));
}

/**
 * Build site-wide styles. For those we aren't using webpack (it's overkill)
 * and instead are just using node-sass via gulp-sass.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function buildSass() {
  if (options.watch) {
    gulp.watch(config.paths.client.sass, ['build:sass']);
  }

  return gulp.src(config.paths.client.sass)
    .pipe(printVerbose('build:sass - read'))
    .pipe(plugins.sass({
      includePaths: [
        './node_modules'
      ]
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.paths.dist + 'css/'))
    .pipe(printVerbose('build:sass - write'));
}

function buildVendor() {
  return gulp.src(config.paths.vendors, {base: 'node_modules'})
    .pipe(printVerbose('build:vendor - read'))
    .pipe(gulp.dest(config.paths.dist + 'vendor/'))
    .pipe(printVerbose('build:vendor - write'));
}

// Cleaning ====================================================================

/**
 * Delete the entire dist/ directory.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function deleteDist(done) {
  clean(config.paths.dist, done);
}

/**
 * Delete the static files out of the dist/ directory.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function deleteStaticFiles(done) {
  clean(config.helpers.staticFilesIn(config.paths.dist), done);
}

/**
 * Delete the css out of the dist/ directory.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function deleteCss(done) {
  clean(config.paths.dist + 'css/**/*.css', done);
}

/**
 * Delete the js out of the dist/ directory.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function deleteJs(done) {
  clean([
    config.paths.dist + 'js/**/*.js',
    config.paths.dist + 'js/**/*.js.map'
  ], done);
}

/**
 * Delete the webpack generated index out of the dist/ directory.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function deleteIndex(done) {
  clean(config.paths.dist + 'index.html', done);
}

/**
 * Delete the webpack generated index out of the dist/ directory.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function deleteVendor(done) {
  clean(config.paths.dist + 'vendor/', done);
}

// Testing =====================================================================

/**
 * Runs the browsers tests on our Angular 2 code using karma.
 *
 * @param {function} done - Gulp callback to indicate task completion.
 */
function runBrowserTests(done) {
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
      let searchMessage = cVerbose('Looking for spec file for: ');
      searchMessage += cPath(event.path.substr(process.cwd().length));
      logVerbose(searchMessage);

      let specPath = event.path.replace(/\.ts$/, '.spec.ts');
      if (!fs.existsSync(specPath)) {
        let bailMessage = cVerbose('No spec file found for file: ');
        bailMessage += cPath(event.path.substr(process.cwd().length));
        logVerbose(bailMessage);

        return;
      }
      event.path = specPath;
    }

    let logMessage = cVerbose('Testing: ');
    logMessage += cPath(event.path.substr(process.cwd().length));
    log(logMessage);
    karmaConfig.files.push(event.path);

    new karma.Server(karmaConfig, () => {
      karmaConfig.files.pop();
    }).start();
  });
}

// Running =====================================================================

/**
 * Runs the project using nodemon for the server and browser-sync for the
 * client. Only intended to be used in development.
 */
function runProject() {
  if (options.prod) {
    // Still allow this so that devs can test that things work when AOT built,
    // but warn that this is not acceptable in production.
    let warning = 'Do not run the project in production using "gulp run".';
    log(cWarning(warning));
  }

  return plugins.nodemon(config.options.nodemon)
    .on('start', () => {
      logVerbose('Nodemon starting.');

      // If we're not building (or not opening at all) then we can go ahead and
      // init the server, which will open it (if that was specified).
      // Otherwise we need to wait until the build is done so there is
      // something to show.
      if (!options.build) {
        initBrowserSync();
      }
    })
    .on('restart', () => {
      logVerbose('Nodemon restarting.');
    });
}

// =============================================================================
// Tasks
// =============================================================================

// Linting =====================================================================
gulp.task('lint',
  'Lint the server with jshint, and the client with tslint.',
  ['lint:jshint', 'lint:jscs', 'lint:tslint', 'lint:tslint:spec']);

gulp.task('lint:jshint', jshint);
gulp.task('lint:jscs', jscs);
gulp.task('lint:tslint',
  tslint(config.paths.client.app.source, './tslint.json', 'lint:tslint'));
gulp.task('lint:tslint:spec',
  tslint(config.paths.client.app.tests,
    './tslint.spec.json',
    'lint:tslint:spec'));

// Builing =====================================================================
gulp.task('build',
  'Build the client site into ./src/client/dist/',
  ['build:webpack', 'build:static', 'build:sass', 'build:vendor']);

gulp.task('build:webpack', ['clean:js', 'clean:index'], buildWebpack);
gulp.task('build:static', ['clean:static'], buildStatic);
gulp.task('build:sass', ['clean:css'], buildSass);
gulp.task('build:vendor', ['clean:vendor'], buildVendor);

// Cleaning ====================================================================
gulp.task('clean', deleteDist);
gulp.task('clean:static', deleteStaticFiles);
gulp.task('clean:css', deleteCss);
gulp.task('clean:js', deleteJs);
gulp.task('clean:index', deleteIndex);
gulp.task('clean:vendor', deleteVendor);

// Testing =====================================================================
gulp.task('test', 'Runs the project\'s unit tests.', runBrowserTests);

// Running =====================================================================
let runDependencies = ['run:nodemon'];
if (options.build) {
  runDependencies.push('build');
}

gulp.task('run',
  'Runs the program using nodemon/browser-sync for auto-reloading.',
  runDependencies,
  noop,
  {
    options: {
      'no-build -B': 'Do not build the application, just run.',
      'no-open -O': 'Do not open a browser on startup.'
    }
  });

gulp.task('run:nodemon', runProject);

// Default =====================================================================
let defaultDependencies = [];
if (options.build) { defaultDependencies.push('build'); }
if (options.run) { defaultDependencies.push('run'); }
if (options.test) { defaultDependencies.push('test'); }
if (options.lint) { defaultDependencies.push('lint'); }

if (!defaultDependencies.length) { defaultDependencies.push('help'); }

gulp.task('default',
  'Run, build, test and lint the project with the watch & verbose flags.',
  defaultDependencies,
  noop,
  {
    aliases: ['dev']
  });
