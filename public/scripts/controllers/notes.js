'use strict';

angular.module('trekApp.controller', [])

/**
 *  Fetch All User Posts
 */

.controller('listArticleCtrl', ['$scope','UserPosts', function ($scope, UserPosts) {
    UserPosts.get(function (data) {
        $scope.posts = data;
    });
}])

/**
 *  Fetch User Posts
 */

.controller('userArticleCtrl', ['$scope', '$http', '$routeParams', 'instagram', 'UserPosts', 'socket', function ($scope, $http, $routeParams, instagram, UserPosts, socket) {

    $scope.posts = [];

    socket.on('photo', function () {
        instagram.grabUser(function (data) {

            var instaPhoto = {
                "title": data[0].caption.text,
                "author": "will",
                "longitude": data[0].location.longitude,
                "latitude": data[0].location.latitude,
                "img": data[0].images.low_resolution.url
            };

            $scope.posts.unshift(instaPhoto);

            $http.post('/api/v1/users/instagram', instaPhoto ).success(function () {
                console.log(instaPhoto);
            });
        });
    });

    UserPosts.get({username: $routeParams.user}, function (data) {
        $scope.posts = data;
    });
}])

/**
 *  Get Location
 */

.controller('postArticleCtrl', ['$scope', 'geolocation', function ($scope, geolocation) {

    var pinPoint = geolocation.position();

    $scope.form = {};

    pinPoint.then(function (currentLocation) {
        $scope.form.latitude = currentLocation.coords.latitude;
        $scope.form.longitude = currentLocation.coords.longitude;
        $scope.form.city = currentLocation.city;
    });
}])

/**
 *  Edit Post
 */

.controller('editArticleCtrl', ['$scope', '$routeParams', '$location', 'UserPosts', function ($scope, $routeParams, $location, UserPosts) {

    $scope.form = {};

    $scope.need = 'editit';

    UserPosts.edit({ username: $routeParams.user, api: 'get', id: $routeParams.id }, function (data) {
        $scope.form = data;
    });

    // update db
    $scope.editPost = function () {
        UserPosts.update({ username: $routeParams.user, api: 'update', id: $routeParams.id }, $scope.form, function () {
            $location.url( '/account/' + $routeParams.user);
        });
    };
}])

/**
 *  Remove Post
 */

.controller('delArticleCtrl', ['$scope', '$routeParams', '$location', 'UserPosts', function ($scope, $routeParams, $location, UserPosts) {

    UserPosts.remove({ username: $routeParams.user, api: 'delete', id: $routeParams.id }, function () {
        $location.url( '/account/' + $routeParams.user);
    });
}]);