'use strict';


var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    InstagramStrategy = require('passport-instagram').Strategy,

    // client auths
    auths = require('./auths'),

    // user model
	User = require('../app/models/users');


module.exports = function(passport){

	/**
	 **  serialize/deserialize
	 **/
	passport.serializeUser(function(user, done) {
		return done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			return done(err, user);
		});
	});


	/**
	 **  local strategy
	 **/
	passport.use(new LocalStrategy(function(username, password, done) {

		User.findOne({ username: username }, function(err, user) {

			if(err) { return done(err); }
			if(!user) { return done(null, false, { message: 'Unknown user ' + username }) }

			user.comparePassword(password, function(err, isMatch) {

				if(err) { return done(err) }
				if(isMatch) { return done(null, user) }
				else {
					return done(null, false, { message: 'Invalid password' });
				}
			});

		});
	}));


	/**
	 **  Instagram strategy
	 **/
	passport.use(new InstagramStrategy({
			clientID: auths.instagram.clientID,
			clientSecret: auths.instagram.clientSecret,
			callbackURL: auths.instagram.callBackURL
		},
		function(req, token, tokenSecret, profile, done) {
			return done(null, profile);
		}
	));

}