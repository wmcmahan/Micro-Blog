'use strict';

angular.module('trekApp', [
    'trekApp.controller',
    'trekApp.services',
    'trekApp.directives',
    'ngResource',
    'ngRoute',
    'ngAnimate'
])

.config(function ($locationProvider, $routeProvider ) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: '/views/main.html'
        })
        .when('/register', {
            templateUrl: '/views/signup.html',
            animate: 'post-view'
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            animate: 'post-view'
        })
        .when('/account/:user', {
            templateUrl: '/views/account.html',
            controller: 'userArticleCtrl'
        })
        .when('/account/:user/map', {
            templateUrl: '/views/map.html',
            // controller: 'mapCtrl',
            animate: 'post-view'
        })
        .when('/account/:user/post', {
            templateUrl: '/views/takenote.html',
            controller: 'postArticleCtrl',
            animate: 'post-view'
        })
        .when('/account/:user/posts/:id', {
            templateUrl: '/views/takenote.html',
            controller: 'editArticleCtrl',
            animate: 'post-view'
        })
        .when('/account/:user/posts/delete/:id', {
            templateUrl: '/views/account.html',
            controller: 'delArticleCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});