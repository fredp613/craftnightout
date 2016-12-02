var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var events = require('./routes/events');
//var exphbs = require('express-handlebars')
var app = express();
import csrf from 'csurf';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import user_controller from './routes/users';
import admin from './routes/admin';
import 'babel-polyfill'

let csrfProtection = csrf({cookie: true});
let parseForm = bodyParser.urlencoded({extended: false});

mongoose.connect('mongodb://localhost/craft');

if (app.get('env')=='production') {
	app.set('trust proxy', 1);
}

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');

var handlebars = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: 'main',
  extname: 'handlebars'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"))


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'vendor')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrfProtection);
let customOpenPaths = ["/", "/events"]



user_controller(app, mongoose, customOpenPaths, "/users");
app.use('/', routes);
app.use('/events', events);
app.use('/admin', admin);



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
