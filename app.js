var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
import 'babel-polyfill'

//var exphbs = require('express-handlebars')
import multer from "multer";
import csrf from 'csurf';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import user_controller from './routes/users';
import admins from './routes/admins';
import events from './routes/events';
import eventhostings from './routes/eventhostings';
import osubscribers from './routes/osubscribers';
var home = require('./routes/index');


var app = express();
dotenv.config();
let csrfProtection = csrf({cookie: true});
//let parseForm = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({ extended: false}))


if (app.get("env")=="fred") {
console.log("connected to DEV db")
	mongoose.connect('mongodb://localhost/craft_dev');
} else {
console.log("connected to PORD db")
  mongoose.connect('mongodb://localhost/craft');

}

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

app.use(cors());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'vendor')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'user_images')));

const crypto = require('crypto');
let storage = multer.diskStorage({
	destination: function(req,file,cb) {
		cb(null, __dirname +'/user_images');
	},
	filename: function(req, file, cb) {
		crypto.pseudoRandomBytes(16,function(err,raw) {
			if (err) return cb(err);
			cb(null, raw.toString('hex') + path.extname(file.originalname));
		});
	}

});
app.use(multer({storage:storage}).single('imgId'));

//app.use(multer({
//	dest: __dirname + '/user_images',
//	filename: function(req,file,cb){
//		console.log(file);
//		cb(null, Date.now() + path.extname(file.originalname));
//	}
//}).single('imgId')); //Beware, you need to match .single() with whatever name="" of your file upload field in html

//app.use(csrfProtection);


let customOpenPaths = ["events", "osubscribers", "eventhostings"]


user_controller(app, mongoose, customOpenPaths, "/users");
app.use('/',home);
app.use('/eventhostings', eventhostings);
app.use('/events', events);
app.use('/osubscribers', osubscribers);
app.use('/admins', admins);


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
