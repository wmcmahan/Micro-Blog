'use strict';


var express = require('express'),
    expressValidator = require('express-validator');

module.exports = function(app, passport, path){

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser({uploadDir:'./uploads'}));
    app.use(expressValidator());
    app.use(express.methodOverride());
    app.use(express.session({secret: 'secret'}));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });

}