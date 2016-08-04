angular
  .module('app')
  .controller('TempsController',['$scope', 'Temperatura' , function($scope, Temperatura) {
    $scope.sortType     = 'Temperatura'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchBar   = '';     // set the default search/filter 

    $scope.temperaturas = Temperatura.find({
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
    });

   

    
  }
  ]);
