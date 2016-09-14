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
        $scope.alertOrig="";
        $scope.alertDest="";
        $scope.alerts = {
            showOrig :false,
            showDest : false,
        };
        $scope.origAlert = $scope.destAlert = [];
            
        
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
                        getAlert();
                    } else {
                        alert('Rota da Google não encontrada');
                    }
            });
            } else {
                alert('Escolha o método de viagem');
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
        
        
        $scope.origClick = function () {
            
            var auto = new google.maps.places.Autocomplete(input);
            google.maps.event.addListener(auto, 'place_changed',function() { 
                var place = auto.getPlace();
                var address = '';
                if (place.address_components) {
                    if(place.address_components[0].long_name == place.address_components[1].long_name){
                         $scope.alertOrig = place.address_components[0].long_name;
                    }
                    else{
                        if(place.address_components[1].long_name == place.address_components[2].long_name){
                            $scope.alertOrig = place.address_components[1].long_name;
                        }
                    }

                }
                $scope.directions.origin = place.geometry.location;
            }); 
        }
        

        $scope.destClick = function () {
            var auto1 = new google.maps.places.Autocomplete(input1);
            google.maps.event.addListener(auto1, 'place_changed',function() { 
                var place = auto1.getPlace();
                var address = '';
                if (place.address_components) {
                    if(place.address_components[0].long_name == place.address_components[1].long_name){
                         $scope.alertDest = place.address_components[0].long_name;
                    }
                    else{
                        for(var i=1;i<place.address_components.length;i++) {
                            if(place.address_components[i].long_name == "Portugal"){
                                $scope.alertDest = place.address_components[i-2].long_name;
                            }
                        }
                    }
                } 
                $scope.directions.destination = auto1.getPlace().geometry.location;
            });
        }
                  
       
        //recolher alertas para a origem e destino $scope.directions.origin  $scope.directions.destination
        function getAlert() {
            $scope.origAlert =[];
            $scope.destAlert = [];
            
            if ($scope.alertOrig!="") {
                
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
                }).$promise.then(function(temperaturas){
                    temperaturas.forEach(function(temperatura) {
                        if(temperatura.cidade.Nome==$scope.alertOrig){
                            //$scope.alerts.orig = temperatura;
                            $scope.alerts.showOrig =true;
                             
                            //$scope.origAlert = temperatura;
                            console.log(temperatura);
                            $scope.origAlert.push(temperatura);

                        }
                    });
                },function(err){
                    console.log(err);
                    alert('Alerta na Origem não encontrado');
                });
            } 
            if($scope.alertDest!=""){
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
                }).$promise.then(function(temperaturas){
                    temperaturas.forEach(function(temperatura) {
                        if(temperatura.cidade.Nome==$scope.alertDest){
                           // $scope.alerts.dest = temperatura;
                            $scope.alerts.showDest =true;
                        //    $scope.destAlert = temperatura;
                            console.log(temperatura);
                            $scope.destAlert.push(temperatura);
                        }
                    })
                    
                    
                },function(err){
                    console.log(err);
                    alert('Alerta no Destino não encontrado');
                });
                

            }
            else {
                if($scope.alertOrig==""){
                    alert('Origem não escolhida ou alerta não encontrado');
                }
                if($scope.alertDest==""){
                    alert('Destino não escolhido ou alerta não encontrado');
                }
            }
            console.log($scope.destAlert);
            console.log($scope.origAlert);
                        
                        
        }


}]);
