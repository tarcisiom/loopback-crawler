angular
  .module('app')
  .controller('TempsController',['$scope', 'Aviso','Temperatura' , function($scope, Aviso, Temperatura
     ) {
    $scope.sortType     = 'Cidade'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchBar   = '';     // set the default search/filter 

    
    /*$scope.avisos = Aviso.find(
        {
            filter: {
                "include":"distrito"
            }
        }
        
    );
    */
    $scope.temperaturas = Temperatura.find({
            filter:{
                include: {
                    relation : "cidade",
                    scope: {
                        include:{
                            relation: "distrito",
                            scope:{
                                include: {
                                    relation :"distrito"
                                }
                            }
                        }
                    }
                }    
            }
            
    });
    console.log($scope.temperaturas);



    
  }
  ]);
