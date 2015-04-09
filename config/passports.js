'use strict';


var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    InstagramStrategy = require('passport-instagram').Strategy,
    auths = require('./auths'),
    User = require('../app/models/users');

var userName;

module.exports = function(passport){

    /**
     **  serialize/deserialize
     **/
    passport.serializeUser(function(user, done) {
        userName = user.name;
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
            User.update({author: userName }, {$set: {'auths.instagram.token': tokenSecret.access_token, 'auths.instagram.userID': profile.id }}, function (err, doc) {
                if(err) { return next(err); }
            });
            return done(null, profile);
        }
    ));

}