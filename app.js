var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {apiRoutes} = require('./routes')
const cors = require('cors')

var app = express();

// Add startup logging
console.log('Starting application...');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config()

console.log('Middleware configured');

app.get("", (req, res) => {
  res.send("hello world")
})
apiRoutes(app);

// Add error handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.error('Error:', err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

console.log('Routes and error handlers configured');

module.exports = app;
