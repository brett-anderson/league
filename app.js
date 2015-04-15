var express     = require('express'),
  path          = require('path'),
  favicon       = require('serve-favicon'),
  logger        = require('morgan'),
  cookieParser  = require('cookie-parser'),
  bodyParser    = require('body-parser'),
  passport      = require('passport'),
  localStrategy = require('passport-local'),
  expressSession = require('express-session'),
  dbConfig      = require('./data/config.js'),
  mongoose      = require('mongoose'),
  flash         = require('connect-flash'),
  initPassport  = require('./passport/config'),
  app           = express();


mongoose.connect(dbConfig.url);

app.use(expressSession({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

initPassport(passport);

var routes = require('./routes/index')(passport);
var api    = require('./routes/api')(passport);

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
