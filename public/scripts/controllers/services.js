'use strict';

angular.module('trekApp.services', ['ngResource'] )

// Geolocation Factory - Create Deferred object
.factory('geolocation', ['$q','$rootScope', function ($q , $rootScope ){
	return {
		position: function () {

			// create deferred object
			var d = $q.defer();

			// create promise
			var promise = d.promise;

			// Geolocation with cb on success
			navigator.geolocation.getCurrentPosition(gainLocal);

			// Find Coords and City on success
			function gainLocal(position) {

				var currentLocation = position;
				var latlng = new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude);
				var geocoder = new google.maps.Geocoder();

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


.factory('socket', function($rootScope) {

	// var socket = io.connect('http://3cda1f8e.ngrok.com/');
	var socket = io.connect('http://localhost:3000');

	return {
		on: function(eventName, callback) { // Return callback to the actual function to manipulate it.
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
})


.factory('instagram', ['$http', function($http){

	return {
		grabUser: function(callback){

            var url = "https://api.instagram.com/v1/users/self/feed?access_token=922680350.f59def8.6a926dcf72944689a4aac1eeb236b5f3&count=1&callback=JSON_CALLBACK";

            $http.jsonp(url).success(function(response){
                callback(response.data);
            });
		}
	}

}])

.factory('UserPosts', ['$resource', function($resource) {

	return $resource('/api/v1/users/:username/:api/:id', {}, {
		get: {method:'GET', isArray: true },
		edit: {method:'GET'},
		save: {method:'POST'},
		update: {method:'PUT'},
		remove: {method:'DELETE'}
	});

}]);
