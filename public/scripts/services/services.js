'use strict';

angular.module('trekApp.services', ['ngResource'] )


/**
 *  Resources Service
**/
.factory('UserPosts', ['$resource', function ($resource) {
	return $resource('/api/v1/users/:username/:api/:id', {}, {
		get: {method:'GET', isArray: true },
		edit: {method:'GET'},
		save: {method:'POST'},
		update: {method:'POST'},
		remove: {method:'DELETE'}
	});
}])


/**
 *  Geolocation Factory - Create Deferred
**/
.factory('geolocation', ['$q','$rootScope', function ($q , $rootScope ){
	return {
		position: function () {

			var d = $q.defer();
			var promise = d.promise;

			// Geolocation with cb on success
			navigator.geolocation.getCurrentPosition(gainLocal);

			// Find Coords and City on success
			function gainLocal(position) {

				var currentLocation = position,
					latlng = new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude),
					geocoder = new google.maps.Geocoder();

				geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {

						// find address
						currentLocation.city = results[0].formatted_address;

						// resolve promise
						$rootScope.$apply(function () {
							// resolve value is a copy of currentLocation object
							d.resolve(angular.copy(currentLocation));
						});
					}
					else {
						console.log('Geocoder failed due to: ' + status);
					}
				});
			}

			// return promise
			return promise;
		}
	};
}])


/**
 *  Socket Service
**/
.factory('socket', ['$rootScope', function ($rootScope) {

	var socket = io.connect('http://localhost:3000');

	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
		    socket.emit(eventName, data, function () {
		        var args = arguments;
		        $rootScope.$apply(function () {
		          if (callback) {
		            callback.apply(socket, args);
		          }
		        });
		    });
	    }
	};
}])


/**
 *  Instagram Service
 *  !! This will eventually be served up from socket via server !!
**/
.factory('instagram', ['$http', function ($http){
	return {
		grabUser: function(callback){

            var access_token = 'ACCESS_TOKEN', // replace with access token
	            url = 'https://api.instagram.com/v1/users/self/feed?access_token=' + access_token + '&count=1&callback=JSON_CALLBACK';

            $http.jsonp(url).success(function(response){
                callback(response.data);
            });
		}
	}
}]);
