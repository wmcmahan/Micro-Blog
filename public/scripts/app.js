'use strict';

angular.module('trekApp', [
	'trekApp.controller',
	'trekApp.services',
	'trekApp.directives',
	'ngResource',
	'ngRoute',
	'ngCookies'
])

.config(function ($locationProvider, $routeProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: '/views/main.html'
		})
		.when('/register', {
			templateUrl: '/views/signup.html',
			controller: 'articleCtrl'
		})
		.when('/account', {
			templateUrl: '/views/account.html',
			controller: 'articleCtrl'
		})
		.when('/login', {
			templateUrl: '/views/login.html',
			controller: 'articleCtrl'
		})
		.when('/:user/posts', {
			templateUrl: '/views/account.html',
			controller: 'listArticleCtrl'
		})
		.when('/:user/posts/:id', {
			templateUrl: '/views/account.html',
			controller: 'editArticleCtrl'
		})
		.when('/:user/posts/delete/:id', {
			templateUrl: '/views/account.html',
			controller: 'delArticleCtrl'
		})
		.otherwise({
		  redirectTo: '/'
		});
});