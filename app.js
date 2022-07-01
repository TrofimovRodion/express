const compression = require('compression')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const session = require('express-session')
const localStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const cors = require('cors')


const indexRouter = require('./src/routes/index.router');
const timelineRouter = require('./src/routes/timeline/timeline.router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1) // trust first proxy

var corsOptions = {
  origin: 'http://192.168.1.54:8080',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))


passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.use(session({
  secret: 'kdjfkjhfaoduepp[jwkopefjia',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new localStrategy((user, password, done) => {
    if (user !== 'test_user')
      return done(null, false, {
        message: 'User not found',
      })
    else if (password !== 'test_password')
      return done(null, false, {
        message: 'Wrong password',
      })

    return done(null, { id: 1, name: 'Test', age: 21 })
  })
)

app.use('/', indexRouter);
app.use('/timeline', timelineRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
