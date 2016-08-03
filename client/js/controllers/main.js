angular
  .module('app')
  .controller('MainController',['$scope', 'Estrada', 'Aviso','Temperatura' , function($scope, Estrada, Aviso, Temperatura
     ) {
    $scope.sortType     = 'Tipo'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchBar   = '';     // set the default search/filter 

    $scope.estradas = // Distrito.estradas();
     Estrada.find(
        {
            filter: {"include":"distrito"
             
            }
        }
        
    );

    
  }
  ]);
