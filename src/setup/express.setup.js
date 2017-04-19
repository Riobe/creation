'use strict';

const express = require('express'),
      path = require('path'),
      //favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      sassMiddleware = require('node-sass-middleware'),
      chalk = require('chalk'),
      log = require('debug')('creation:setup:express');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in ./src/client/static/images
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, '..', 'client', 'static', 'sass'),
  dest: path.join(__dirname, '..', 'client', 'dist', 'css'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use('/@angular', express.static(path.resolve('./node_modules/@angular')));
app.use('/zone.js', express.static(path.resolve('./node_modules/zone.js')));
app.use('/rxjs', express.static(path.resolve('./node_modules/rxjs')));
app.use('/core-js', express.static(path.resolve('./node_modules/core-js')));
app.use('/toastr', express.static(path.resolve('./node_modules/toastr')));

app.use('/api/users', require('../api/users'));
app.use('/api/events', require('../api/events'));
app.use('/api/login', require('../api/login'));
app.use('/api/logout', require('../api/logout'));
app.use('/api/users', require('../api/users'));
app.use('/api/current-identity', require('../api/current-identity'));
app.get(/^(?!\/api\/)[^\.]*$/, (req, res) => {
  log(`Requested ${chalk.cyan(req.path)}, returning ${chalk.yellow('index')}.`);
  res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) { // jshint ignore:line
  // set locals, only providing error in development
  let environment = req.app.get('env');
  res.locals.message = err.message;
  res.locals.error = environment === 'dev' ? err : {};
  log(`${chalk.red(`Error (${environment})`)} ${chalk.cyan(req.path)}: ${err}`);

  res.status(err.status || 500);

  // Render API errors in JSON.
  if (req.path.startsWith('/api')) {
    return res.json(environment !== 'dev' ?
      { error: err.message } :
      {
        error: {
          message: err.message,
          status: err.status,
          stack: err.stack
        }
      });
  }

  // render the error page
  res.render('error');
});

module.exports = app;

