'use strict';


var posts = require('../controllers/posts'),
	routes = require('../controllers/index'),
	user = require('../controllers/users');


module.exports = function (app, passport){

	// top level
	app.post('/signup', user.signup );
	app.post('/login', user.login );
	app.get('/logout', user.logout );
	app.get('/account', ensureAuthenticated, user.showAccount);

	// instagram auth
	app.get('/auth/instagram', passport.authorize('instagram', { failureRedirect: '/account' }));
	app.get('/auth/instagram/callback', passport.authorize('instagram', { failureRedirect: '/login' }),
		function(req, res) { res.redirect('/account');
	});

	// get instagram challenge
	app.get('/callback', posts.instaChallenge);
	app.post('/callback', posts.instaSocket);

	// endpoints
	app.get('/api/v1/users', posts.publicPosts );
	app.post('/api/v1/users', ensureAuthenticated, posts.create );
	app.post('/api/v1/users/instagram', ensureAuthenticated, posts.storeInstagram );
	app.post('/api/v1/users/:username', ensureAuthenticated, posts.create );

	app.get('/api/v1/users/:username/get/:id', ensureAuthenticated, posts.post );
	app.put('/api/v1/users/:username/update/:id', ensureAuthenticated, posts.editPost );
	app.del('/api/v1/users/:username/delete/:id', ensureAuthenticated, posts.delPost );

	app.get('*', routes.index);

	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login')
	}

}