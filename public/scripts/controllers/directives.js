'use strict';

angular.module('trekApp.directives', [])

.directive('map', function () {

    var map;
    var bounds = [];

    var layer = 'toner-background';

    var currentPosition;

    var mapOptions = {
         center: new google.maps.LatLng(37.7, -122.4),
         zoom: 12,
         mapTypeId: layer,
         panControl: false,
         zoomControl: false,
         mapTypeControlOptions: {
             mapTypeIds: [layer]
         }   
     };

    return {
        scope: {
            markers: '='
        },
        link: function(scope, element, attrs) {

            // create map
            map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);

            // setup map type
            map.mapTypes.set(layer, new google.maps.StamenMapType(layer));    
            
            // watch for changes in posts
            scope.$watch(function(){ return scope.markers }, function(newVal,oldVal) {
                findLocations(newVal);
            });

            // find post location
            // function findLocations(postLocations) {

            //     var myMarkers = [];

            //     angular.forEach(postLocations, function (value) {

            //          var lat = value.latitude,
            //              lng = value.longitude;

            //          this.push([lat,lng]);

            //          markerIt(lat,lng);

            //     }, myMarkers);


            //     panToCurrent(myMarkers[0][0], myMarkers[0][1]);
            // };

            // plot marker
            // function markerIt(lat,lgn) {

            //     var position = new google.maps.LatLng(lat,lgn);

            //     var ltlgBounds = new google.maps.LatLngBounds();

            //         ltlgBounds.extend(position);

            //     var marker = new google.maps.Marker({
            //         position: position,
            //         map: map
            //     });

            //     bounds.push(ltlgBounds);

            //     // map.fitBounds(ltlgBounds);

            // };

            // pan to last location
            // function panToCurrent(lat,lgn) {
            //     currentPosition = new google.maps.LatLng(lat,lgn);
            //     map.panTo(currentPosition);
            // };


            

        }

    };
  
});

