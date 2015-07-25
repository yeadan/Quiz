var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials= require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');


var routes = require('./routes/index');
//var users = require('./routes/users'); modificacion modulo 6 1

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico')); // cambio modulo 6 1
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

//Controlar el tiempo de sesión, P2P modulo 9
app.use(function(req, res, next) {
    if (req.session.user) {
        if (!req.session.timer) {
            req.session.timer = Date.now();
        }
        if (Date.now()-req.session.timer> 120000) { 
                        //Si está inactivo 2 minutos se hace un logout.
            delete req.session.user;
            req.session.timer=null;
            console.log("Sesion cerrada por inactividad");
        } else {
                        // Sino, se resetea el contador de tiempo.   
            req.session.timer = Date.now();
        }
    }
    next();
});

app.use(function(req, res, next) {
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }
    res.locals.session = req.session;
    next();
});


app.use('/', routes);
// app.use('/users', users); modificacion modulo 6 1

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
