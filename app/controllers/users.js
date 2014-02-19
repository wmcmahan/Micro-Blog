'use strict';

// user model
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = require('../models/users');


/**
 **  login
 **/
exports.login = function (req, res, next) {

	passport.authenticate('local', function(err, user, info) {

		if (err) { return next(err) }

		if (!user) {
			req.session.messages =  [info.message];
			return res.redirect('/')
		}

		req.logIn(user, function(err) {
			if (err) { return next(err); }

			// !since no instagram id are set!
			// return res.redirect('/auth/instagram');
			return res.redirect('/account/' + req.user.username);
		});

	})(req, res, next);
}


/**
 **  logout
 **/
exports.logout = function(req, res){
	req.logout();
	return res.redirect('/');
}


/**
 **  register user
 **/
exports.signup = function(req, res, next){

	var errors = req.validationErrors(),
		userName = req.sanitize('username', 'Invalid getparam').xss(),
		user = new User({ username: req.body.username, password: userName});

	req.assert('password', 'Invalid urlparam').isAlpha();
	req.assert('username', 'Invalid').isAlphanumeric();

	if(!errors) {
		user.save(function(err){
			if(err.code === 'E11000') {
				console.log('err.code');
			}
			if(err) { console.log(err); }
			else {
				console.log(user);
				res.redirect('/account');
			}
		});
	}
	else {
		res.redirect('/login');
	}
}


