'use strict';

angular.module('trekApp.controller', [])


.controller('articleCtrl', ['$scope', '$location', '$http', 'geolocation', 'instagram', 'UserPosts', 'socket', function ($scope, $location, $http, geolocation, instagram, UserPosts, socket) {

	$scope.form = {};

	$scope.posts = [];

	// new instance
	$scope.pinPoint = geolocation.position();

	// success callback for location results
	$scope.pinPoint.then(function(currentLocation){
		$scope.form.latitude = currentLocation.coords.latitude;
		$scope.form.longitude = currentLocation.coords.longitude;
		$scope.form.city = currentLocation.city;
	});

	var instaPhoto;


	socket.on('photo', function () {
        instagram.grabUser(function(data){

        	instaPhoto = {
        		"title": data[0].caption.text,
			    "author": "will",
			    "longitude": data[0].location.longitude,
			    "latitude": data[0].location.latitude,
			    "img": data[0].images.low_resolution.url
        	};

			$scope.posts.unshift(instaPhoto);

			$http.post('/api/v1/users/instagram', instaPhoto ).success(function(){
				console.log(instaPhoto);
			})

		});
    });

	$scope.getPosts = function() {
		UserPosts.get(function(data) {
			$scope.posts = data;
		});
	};

	$scope.addPost = function(){
		// UserPosts.save($scope.form, function(){
			// $location.path('/account');
			// $scope.getPosts();
		// });
		// socket.emit('send', $scope.form);
	};

	$scope.uploadFile = function(files) {
	    $scope.form.img = files[0];
	};




	$scope.getPosts();

}])


.controller('listArticleCtrl', ['$scope', '$http', 'UserPosts', function ($scope, $http, UserPosts) {

	// request users Articles document
	UserPosts.get(function(data) {
		$scope.posts = data;
	});



}])


.controller('editArticleCtrl', ['$scope', '$http', '$routeParams', '$location', 'UserPosts', function ($scope, $http, $routeParams, $location, UserPosts) {

	$scope.form = {};

	$scope.need = 'editit';

	// request users Articles document
	UserPosts.edit(
		{
			username: $routeParams.user,
			api: 'get',
			id: $routeParams.id
		},
		function(data) {
			$scope.form = data;
		});


	$scope.editPost = function () {

		UserPosts.update(
			{
				username: $routeParams.user,
				api: 'update',
				id: $routeParams.id
			}, $scope.form, function() {
				$location.url( '/account');
			});
	};


}])


.controller('delArticleCtrl', ['$scope', '$routeParams', '$location', 'UserPosts', function ($scope, $routeParams, $location, UserPosts) {

	UserPosts.remove(
		{
			username: $routeParams.user,
			api: 'delete',
			id: $routeParams.id
		},
		function() {
			$location.url( '/account');
			$scope.getPosts
		});

	$scope.getPosts = function() {
		UserPosts.get(function(data) {
			$scope.posts = data;
		});
	};

}]);




