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
    .controller('MapController',['$scope', 'Estrada', 'Temperatura', '$log', 'uiGmapGoogleMapApi', function ($scope, Estrada, Temperatura, $log,uiGmapGoogleMapApi, GoogleMapApi, $document) {
        // lista de marcadores
        $scope.Rmarkers = [];

       //mapa
        $scope.map = {
            "control": {},
            "center": {
                "latitude": 41.561616,
                "longitude": -8.397380
            },
            "zoom": 13,
        }; 

        //click no marcador abre a window
        $scope.onClick = function(marker, eventName,model) {
            model.show = !model.show;
        };
        
        //recolher ocorrencias para colocar nos marcadores  
        Estrada.find({
            filter: {"include":"distrito"} 
        })
        .$promise.then(function(estradas) {
            $num = 1;
            var coords1, latitude, longitude, geocoder;
            estradas.forEach(function(estrada) {
                 var icon;
                 if (estrada.Tipo=='Trabalhos') {
                     icon ='../../imagens/trabalhos.png';
                 }
                 if (estrada.Tipo=='Condicionamento') {
                     icon ='../../imagens/alert.png';
                 }
                 if (estrada.Tipo=='Outros') {
                     icon ='../../imagens/outros.png';
                 }
                 var marker = {
                    id: $num,
                    coords: {
                        latitude: estrada.lat,
                        longitude: estrada.lon
                    },
                    title: estrada.Tipo + " - " + estrada.Concelho,
                    data: estrada.Data,
                    show: false,
                    options: {
                        icon:icon
                    }
                };
                $scope.Rmarkers.push(marker);
                $num++;
            });
        },
        function(err){

        });
       
        // opções de modo de locução
        $scope.opts = [
            {
                name: "Carro",
                code: google.maps.TravelMode.DRIVING
            },
            {
                name: "A Pé",
                code: google.maps.TravelMode.WALKING
            }
        ];
        
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
            $longitude = location.coords.longitude;
        }) 
       
        // set location based on users current gps location 
        $scope.setCenter = function () {
            $scope.map.center = {
                latitude : $latitude,
                longitude: $longitude
            }
            $scope.marker1 = {
                id: 0,
                coords: {
                    latitude : $latitude,
                    longitude: $longitude
                },
                title: "A minha localização"
            };
            $scope.Rmarkers.push($scope.marker1);
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
        
        function autocomp(inp, local) {
            var auto = new google.maps.places.Autocomplete(inp);
            google.maps.event.addListener(auto, 'place_changed',function() { 
                var place = auto.getPlace();
                var address = '';
                if (place.address_components) {
                    address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
                // nomes dos lugares
               // $log.log(auto.getPlace().name +" - " + address);
                
                local = place.geometry.location;
            });
        }
        
        $scope.origClick = autocomp(input, $scope.directions.origin); /*function () {
            /*
            var auto = new google.maps.places.Autocomplete(input);
            google.maps.event.addListener(auto, 'place_changed',function() { 
                var place = auto.getPlace();
                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
                $log.log(auto.getPlace().name +" - " + address);
                
                $scope.directions.origin = place.geometry.location;
            }); 
        }
        */

        $scope.destClick = autocomp(input1, $scope.directions.destination);/*function () {
            var auto1 = new google.maps.places.Autocomplete(input1);
            google.maps.event.addListener(auto1, 'place_changed',function() { 
                $scope.directions.destination = auto1.getPlace().geometry.location;
            });
        }
        */           
       
        //recolher alertas para a origem e destino $scope.directions.origin  $scope.directions.destination
        $scope.alertClick = function(){
            if ($scope.directions.origin!=null) {
                
            } else {
                alert('Origem não escolhida');
            }
    /* 
            Temperatura.find({
                filter:{ 
                    include: {
                        relation : "cidade",
                        scope: {
                            include:[{
                                    relation: "distrito",
                                    scope:{
                                        include: {
                                            relation :"aviso"
                                        }
                                    }
                                },
                                {
                                    relation:"sismo"
                                }]
                        }
                    }
                }
            })
*/
        }


}]);
