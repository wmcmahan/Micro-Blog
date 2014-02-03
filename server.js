'use strict';


var express = require('express'),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    path = require('path'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);


// middleware settings
require('./config/express')(app, passport, path);


// register db
var database = require('./config/database');

// connect db
mongoose.connect(database.url, function (err, res) {
  if (err) throw err;
  console.log('Successfully connected');
});


// environments
if ('development' == app.get('env')) {
	app.set('views', __dirname + '/public');
	app.use(express.errorHandler());
}
else {
	app.set('views', __dirname + '/dist');
	app.use(express.static(path.join(__dirname, 'dist')));
}


// passport auths
require('./config/passports')(passport);

// refactor to into seperate modules
require('./app/routes/routes')(app, passport, io, http);


// listen
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

