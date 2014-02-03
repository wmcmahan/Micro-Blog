
// Dependencies
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
	passport = require('passport'),
	fs = require('fs'),
	http = require('http'),
	LocalStrategy = require('passport-local').Strategy;


// article model
var Article = require('../models/post');

// user model
var User = require('../models/users');









// instagram subscribe cb
exports.subscribeGet = function(req, res){
	if(req.param("hub.challenge") != null){
	  res.send(req.param("hub.challenge"));
	} else {
	  console.log("ERROR on suscription");
	}
}


// subscribe post - EMIT
exports.subscribePost = function(req, res) {

	http.get({
	  host: 'api.instagram.com',
	  path: '/v1/users/self/feeds?access_token=922680350.ea2f708.5cb1dd5f357d4db68aed558448b0ce3b',
	  agent: false
	}, function(res){

	  var raw = '';

	  req.on('error', function (err) {
		console.log(err);
	  });

	  res.on('data', function(chunk) {
		raw += chunk;
	  });

	  res.on('end', function() {
		// emit socket - no arguments
		io.sockets.emit('photo', function(socket){
		  console.log('send socket');
		});
	  });

	});

  res.writeHead(200);
}


// show account
exports.showAccount = function(req, res) {
  res.render('index.html', { title: 'welcome ' + req.user.username });
}


// create post
exports.create = function (req, res) {


  // image upload
  var imageLoc = null;

  if(req.files.thumbnail.size != 0 ){

	var tmp_path = req.files.thumbnail.path;
	var target_path = './app/images/' + req.files.thumbnail.name;

	imageLoc = 'images/' + req.files.thumbnail.name;

	// move the file
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
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
	if(err) console.log(err);
	else {
	  console.log(article);
	  res.json(article);
	  res.redirect('/account');
	}
  })

}





exports.instaChallenge = function(req, res){
  if(req.param("hub.challenge") != null){
	  res.send(req.param("hub.challenge"));
	} else {
	  console.log("ERROR on suscription");
	}
}

exports.instaSocket = function(req, res) {

	http.get({
	  host: 'api.instagram.com',
	  path: '/v1/users/self/feeds?access_token=922680350.ea2f708.5cb1dd5f357d4db68aed558448b0ce3b',
	  agent: false
	}, function(res){

	  var raw = '';

	  req.on('error', function (err) {
		console.log(err);
	  });

	  res.on('data', function(chunk) {
		raw += chunk;
	  });

	  res.on('end', function() {
		// emit socket - no arguments
		io.sockets.emit('photo', function(socket){
		  console.log('send socket');
		});
	  });

	});

  res.writeHead(200);
}


// store instagram content
exports.storeInstagram = function (req, res) {

  console.log(req.body.img);

  var article = new Article({
	title: req.body.title,
	author: req.user.username,
	longitude: req.body.longitude,
	latitude: req.body.latitude,
	img: req.body.img
  });

  article.save(function(err){
	if(err) throw err;
	else console.log(article);
  });
}


// return all posts
exports.allPosts = function(req, res) {

  Article.find({ author: req.user.username }).sort({date: -1}).exec(function (err, docs) {
	if(err) console.log(err);
	return res.json(docs);
  })

}


// public
exports.publicPosts = function(req, res) {

  Article.find().sort({date: -1}).exec(function (err, docs) {
	if(err) console.log(err);
	return res.json(docs);
  })

}


// return single post
exports.post = function(req, res) {

  var id = req.params.id;

  Article.findById(id, function (err, docs) {
	if(err) console.log(err);
	return res.json(docs);
  })

}


// return post by title
exports.getUser = function (req, res) {

  var title = req.query.q;

  Article.find({
	author: req.user.username,
	title: title
  },
  function (err, docs) {
	  if(err) console.log(err);
	  return res.json(docs);
  })

}


// edit posts
exports.editPost = function(req, res) {

  var title = req.body.title;
  var content = req.body.content;
  var id = req.params.id;

  Article.findByIdAndUpdate(id, {title: title, content: content },
	function (err, docs) {
	  if(err) console.log(err);
	  return res.json(docs);
  })

}


// delete posts
exports.delPost = function(req, res) {

  var title = req.body.title;
  var content = req.body.content;
  var id = req.params.id;

  Article.findByIdAndRemove (id, function (err, docs) {
	if(err) console.log(err);
	return res.json(docs);
  })

}


exports.restricted = function(req, res) {
	user.findOne({username: req.params.username}, function(error, thread) {
		res.render('views/main.html', {title: 'Hello' + req.params.username });
	})
}

