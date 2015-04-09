'use strict';

var posts = require('../controllers/posts'),
    routes = require('../controllers/index'),
    user = require('../controllers/users');

module.exports = function (app, passport) {

    function ensureAuthenticated (req, res, next) {
        if (!req.isAuthenticated()) {
            return res.send(401, 'User is not authorized');
        } else {
            return next();
        }
    }

    // top level
    app.post('/signup', user.signup );
    app.post('/login', user.login );
    app.get('/logout', user.logout );
    app.get('/account/:username', ensureAuthenticated, posts.userInfo);

    // instagram auth
    app.get('/auth/instagram', passport.authorize('instagram', { failureRedirect: '/' }));
    app.get('/auth/instagram/callback', passport.authorize('instagram', { failureRedirect: '/login' }),
        function(req, res) { res.redirect('/account/' + req.user.username);
    });

    // get instagram challenge
    app.get('/callback', posts.instaChallenge);
    app.post('/callback', posts.instaSocket);

    // endpoints
    app.get('/api/v1/users/:username/get/:id', ensureAuthenticated, posts.post );
    app.post('/api/v1/users/:username/update/:id', ensureAuthenticated, posts.editPost );
    app.del('/api/v1/users/:username/delete/:id', ensureAuthenticated, posts.delPost );
    app.get('/api/v1/users/:username', ensureAuthenticated, posts.posts );

    app.get('/api/v1/users', posts.publicPosts );
    app.post('/api/v1/users', ensureAuthenticated, posts.create );
    app.post('/api/v1/users/instagram', ensureAuthenticated, posts.storeInstagram );
    app.post('/api/v1/users/:username', ensureAuthenticated, posts.create );

    app.all('*', routes.index);

}