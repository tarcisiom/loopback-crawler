angular
    .module('app')
    /*.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            key: '[removed]',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'places' // <--- see? there
        });
    }])
    */
    .controller('MapController',['$scope', '$log', 'uiGmapGoogleMapApi', function ($scope, $log,uiGmapGoogleMapApi, GoogleMapApi,  $document) {
        
        $scope.map = {
            "control": {},
            "center": {
                "latitude": 52.47491894326404,
                "longitude": -1.8684210293371217
            },
            "zoom": 15
        }; 
        $scope.opts = [
            {
                name: "Carro",
                code: google.maps.TravelMode.DRIVING},
            {
                name: "A Pé",
                code: google.maps.TravelMode.WALKING},
        ];
         
        $scope.marker = {
            id: 0,
            coords: {
                latitude: 52.47491894326404,
                longitude: -1.8684210293371217
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    $scope.marker.options = {
                        draggable: true,
                        labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                        labelAnchor: "100 0", 
                        labelClass: "marker-labels"
                    };
                }
            }
        };
       /* var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }
                $scope.map = {
                    "center": {
                        "latitude": place[0].geometry.location.lat(),
                        "longitude": place[0].geometry.location.lng()
                    },
                    "zoom": 18
                };
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    }
                };
                
            }
        };
        $scope.searchbox = { template: 'searchbox.tpl.html', events: events };
     */                         
        // instantiate google map objects for directions
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var geocoder = new google.maps.Geocoder();
        
        // directions object -- with defaults
        $scope.directions = {
          origin: "",
          destination: "",
          showList: false
        };
        
        
        // get directions using google maps api
        $scope.getDirections = function () {
          if (angular.isDefined($scope.routeMode) ) {
              
            var request = {
                origin: $scope.directions.origin,
                destination: $scope.directions.destination,
                provideRouteAlternatives: true,
                travelMode: $scope.routeMode
            };
            directionsService.route(request, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap($scope.map.control.getGMap());
                    directionsDisplay.setPanel(document.getElementById('directionsList'));
                    directionsDisplay.setOptions({
                        draggable:true     
                    });
              /*      directionsDisplay.addListener('directions_changed', function () {
                        computeTotalDistance(directionsDisplay.getDirections());
                    });
                */
                    $scope.directions.showList = true;
                
                } else {
                alert('Google route unsuccesfull!');
                }
            });
          } else {
              alert('Choose a Travel Mode');
          }  
          
        };
        
        // get current browser position
        navigator.geolocation.getCurrentPosition(function(location) {
            $latitude = location.coords.latitude;
            $longitude =location.coords.longitude;
        }) 
       
        // set location based on users current gps location 
        $scope.setCenter = function () {
            $scope.map.center = {
                latitude : $latitude,
                longitude: $longitude
            }
            $scope.marker = {
                id: 1,
                coords: {
                    latitude : $latitude,
                    longitude: $longitude
                },
                options: { draggable: true },
                events: {
                    dragend: function (marker, eventName, args) {

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };
        }
        
        // auto complete do googlemaps
        var input = document.getElementById('origin');
        var input1 = document.getElementById('destination');
        
        
        // limpar um percurso
        $scope.clearRoute = function() {
            
            //directionsDisplay.setMap(null);
            //directionsDisplay = new google.maps.DirectionsRenderer();
            //directionsDisplay.setDirections({ routes: [] }); 
             //$scope.routeMode = undefined;
            directionsDisplay.set('directions', null);
            
        };
        
        
        $scope.origClick = function () {
            var auto = new google.maps.places.Autocomplete(input);
            google.maps.event.addListener(auto, 'place_changed',
                function() { 
                    $scope.directions.origin = auto.getPlace().geometry.location;
                } 
            ); 
        }
     
        $scope.destClick = function () {
           var auto1 = new google.maps.places.Autocomplete(input1);
           google.maps.event.addListener(auto1, 'place_changed',
                function() { 
                    $scope.directions.destination = auto1.getPlace().geometry.location;
                } 
            );
           
        }
}]);
