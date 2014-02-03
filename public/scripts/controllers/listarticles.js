'use strict';

angular.module('trekApp')

// Controller
.controller('listArticleCtrl', ['$scope', '$http', function ($scope, $http) {

	// request users Articles document
	$http({method:'GET', url:'/userPost'})
		.success(function(data) {
			$scope.posts = data;
		});
}]);