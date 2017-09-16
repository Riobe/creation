'use strict';

const express = require('express'),
      path = require('path'),
      //favicon = require('serve-favicon'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      uuidv1 = require('uuid/v1'),
      chalk = require('chalk'),
      inspect = require('util').inspect,
      db = require('./mongoose.setup'),
      passport = require('passport'),
      requestLog = require('debug')('jeremypridemore-me:request'),
      log = require('debug')('jeremypridemore-me:setup:express');

log('Setting up express.');
const cookieSecret = process.env.COOKIE_SECRET ||
  'spoaifnsdopfinasoin Secret COOKIE Phrase!!! 2890347nasS*DFJ)(*YWSHDF';

log(`Using cookie secret of: ${cookieSecret}`);
let app = express();

// =============================================================================
// Setup
// =============================================================================
// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

// =============================================================================
// Middleware
// =============================================================================

// uncomment after placing your favicon in ./src/client/static/images
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: cookieSecret,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hour
  },
  store: new MongoStore({
    mongooseConnection: db
  }),
  resave: true,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  req.id =  uuidv1();
  req.log = function(message) {
    if (typeof message === 'object') {
      message = inspect(message, { depth: 5 });
    }

    requestLog(`${new Date()} - ${req.id} - ${message}`);
  };

  next();
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// =============================================================================
// Static routes
// =============================================================================

// Up and out of src directory and into dist.
app.use(express.static(path.resolve('./dist')));

// =============================================================================
// API routes
// =============================================================================
app.use('/api/heartbeat', require('../api/heartbeat'));
app.use('/api/users', require('../api/users'));
app.use('/api/login', require('../api/login'));

// =============================================================================
// Web catch-all route
// =============================================================================

function returnIndex(req, res) {
  res.sendfile(path.resolve('./dist/index.html'));
}
app.get('/', returnIndex);
app.get('/index.htm', returnIndex);
app.get('/index.html', returnIndex);

// =============================================================================
// Error handling
// =============================================================================

// Catch 404 if no other route has hit and forward to error handler.
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// General error handler.
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

