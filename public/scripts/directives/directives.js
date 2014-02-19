'use strict';

angular.module('trekApp.directives', [])


/**
 *  Unique route transitions
**/
.directive('animClass',function($route){
	return {
		link: function(scope, elm, attrs){
			var enterClass = $route.current.animate;
				elm.addClass(enterClass);

			scope.$on('$destroy', function(){
				elm.removeClass(enterClass);
				elm.addClass($route.current.animate);
			});
		}
	}
})


/**
 *  Google Maps
**/
.directive('map', function () {

    var map,
	    layer = 'toner-background',

		mapOptions = {
			center: new google.maps.LatLng(37.7, -122.4),
			zoom: 12,
			mapTypeId: layer,
			disableDefaultUI: true,
			panControl: false,
			zoomControl: false
		};

    return {
        scope: {
            markers: '=',
            marker: '='
        },
        link: function(scope, element, attrs) {

            var myMarkers = [];

            // create map
            map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);

            // setup map type
            map.mapTypes.set(layer, new google.maps.StamenMapType(layer));

			// watch for change in location
            scope.$watch('marker.city', function(newValue, oldValue){
            	if (newValue !== oldValue) {
				    markerIt(scope.marker.latitude,scope.marker.longitude);
			    }
            });

            if(scope.markers){
            	findPosts();
            }

            // find locations
            function findPosts(){
	            for(var i = 0; 0 < scope.markers.length; i++) {
	                if(scope.markers[i].latitude && scope.markers[i].longitude) {
	                    var lat = scope.markers[i].latitude,
	                        lng = scope.markers[i].longitude;

	                    myMarkers.push([lat,lng]);
	                    markerIt(lat,lng);
	                }
	            }
	        }

            // plot marker
           function markerIt(lat,lgn) {
            	// set position
                var position = new google.maps.LatLng(lat,lgn);

				// create marker
                var marker = new google.maps.Marker({
                    position: position,
                    map: map
                });

                // pan to last location
                map.panTo(position);
            };

        }
    }
});

