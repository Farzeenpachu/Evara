const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressEjsLayouts = require('express-ejs-layouts')
const mongoose=require('mongoose');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const session = require('express-session')
const toastr= require('toastr')
require('./config/connection');

const app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout','Layouts/userLayout')
app.use(expressEjsLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'key',
  saveUninitialized:false,
  cookie:{
    maxAge: 1000*60*60*24*10
  },
  resave:false
}))
app.use(function nocache (req,res,next){
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})


app.use('/admin', adminRouter);
app.use('/', userRouter);







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
