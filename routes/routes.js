
var api = require('./api'),
	routes = require('./index');



module.exports = function (app, passport, io, http){

	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login')
	}

	// instagram auth
	app.get('/auth/instagram', passport.authorize('instagram', { failureRedirect: '/account' }));
	app.get('/auth/instagram/callback', passport.authorize('instagram', { failureRedirect: '/login' }), function(req, res) { res.redirect('/account'); });

	// get instagram challenge
	app.get('/callback', api.instaChallenge);
	app.post('/callback', api.instaSocket);

	// top level
	app.get('/', routes.index);
	app.post('/signup', api.signup );
	app.post('/login', api.login );
	app.get('/logout', api.logout );
	app.get('/account', ensureAuthenticated, api.showAccount);

	// do i need these?
	app.get('/userPost', ensureAuthenticated, api.allPosts );
	app.get('/users/:userName', ensureAuthenticated, api.getUser );
	app.get('/users', ensureAuthenticated, api.showAccount );
	app.get('/:username/posts/:id', ensureAuthenticated, api.post );

	// api
	app.get('/api/v1/users', api.publicPosts );
	app.post('/api/v1/users', ensureAuthenticated, api.create );
	app.post('/api/v1/users/instagram', ensureAuthenticated, api.storeInstagram );
	app.post('/api/v1/users/:username', ensureAuthenticated, api.create );

	app.get('/api/v1/users/:username/get/:id', ensureAuthenticated, api.post );
	app.put('/api/v1/users/:username/update/:id', ensureAuthenticated, api.editPost );
	app.del('/api/v1/users/:username/delete/:id', ensureAuthenticated, api.delPost );

	app.get('*', routes.index);

}