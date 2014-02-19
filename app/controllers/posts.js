'use strict';


var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
	passport = require('passport'),
	fs = require('fs'),
	http = require('http'),
	LocalStrategy = require('passport-local').Strategy,

	// article model
	Article = require('../models/post');


/**
 **  instagram subscribe cb
 **/
exports.instaChallenge = function(req, res){
	if(req.param("hub.challenge") != null){
		res.send(req.param("hub.challenge"));
	} else {
		console.log("ERROR on suscription");
	}
}


/**
 **  subscribe post - EMIT
 **/
exports.instaSocket = function(req, res) {

	var host = 'api.instagram.com',
		path = '/v1/users/self/feeds?access_token=',
		token = '_token_';

	http.get({ host: host, path: path + token, agent: false },

	function(res){

		var raw = '';

		req.on('error', function (err) {
			return next(err);
		});

		res.on('data', function(chunk) {
			raw += chunk;
		});

		res.on('end', function() {
			// emit socket - no arguments
			io.sockets.emit('photo', function(socket){
				console.log(socket);
			});
		});

	});

}


/**
 **  store instagram content
 **/
exports.storeInstagram = function (req, res, next) {

	var article = new Article({
		title: req.body.title,
		author: req.user.username,
		longitude: req.body.longitude,
		latitude: req.body.latitude,
		img: req.body.img
	});

	article.save(function(err){
		if(err) return next(err);
	});
}



exports.userInfo = function(req, res){
	return res.render('index.html',{username: req.user.username });
}


/**
 **  create post
 **/
exports.create = function (req, res, next) {

	var imageLoc = null,
		tmp_path = req.files.thumbnail.path,
		target_path = './public/images/' + req.files.thumbnail.name;

	// image upload
	if(req.files.thumbnail.size != 0 ){

		imageLoc = '/images/' + req.files.thumbnail.name;

		// move the file
		fs.rename(tmp_path, target_path, function(err) {

			if (err) { throw err; }

			// delete the temporary file
			fs.unlink(tmp_path, function() {
				if (err) throw err;
				res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
			});

		});
	};

	var article = new Article({
		id: req.user.id,
		title: req.body.title,
		content: req.body.content,
		author: req.user.username,
		longitude: req.body.longitude,
		latitude: req.body.latitude,
		city: req.body.city,
		img: imageLoc
	});

	article.save(function(err){
		if(err) return next(err);
		else {
			console.log(article);
			return res.redirect('/account/' + req.user.username );
		}
	})
}


/**
 **  public
 **/
exports.publicPosts = function(req, res) {

	if (!req.isAuthenticated()) {

		Article.find().sort({date: -1}).exec(function (err, docs) {
			if(err) return next(err);
			return res.json(docs);
		})
	} else {
		Article.find({author:req.user.username}).sort({date: -1}).exec(function (err, docs) {
			if(err) return next(err);
			return res.json(docs);
		})
	}
}


/**
 **  return all posts
 **/
exports.posts = function(req, res, next) {

	Article.find({author:req.user.username}).sort({date: -1}).exec(function (err, docs) {
		if(err) return next(err);
		return res.json(docs);
	})
}


/**
 **  return single posts
 **/
exports.post = function(req, res, next) {

	var id =req.params.id;

	Article.findById(id, function(err, docs) {
		if(err) return next(err);
		return res.json(docs);
	})
}


/**
 **  get users articles
 **/
exports.getUser = function (req, res, next) {

	Article.find({author: req.user.username, title: req.query.q }, function (err, docs) {
		if(err) return next(err);
		return res.json(docs);
	})
}


/**
 **  edit post
 **/
exports.editPost = function(req, res, next) {

	var id = req.params.id,
		title = req.body.title,
		content = req.body.content;

	Article.findOneAndUpdate({_id: id }, {title: title, content: content }, function (err, docs) {
		if(err) { return next(err); }
		else {
			return res.json(docs);
		}
	})
}


/**
 **  delete post
 **/
exports.delPost = function(req, res, next) {

	Article.findByIdAndRemove (req.params.id, function (err, docs) {
		if(err) return next(err);
		return res.json(docs);
	})
}

