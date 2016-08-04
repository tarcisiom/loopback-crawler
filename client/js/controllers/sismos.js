angular
  .module('app')
  .controller('SismosController',['$scope', 'Sismo' , function($scope, Sismo) {
    $scope.sortType     = 'Descricao'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchBar   = '';     // set the default search/filter 

    $scope.sismos = Sismo.find({
        filter:{ 
                include: {
                    relation : "cidade"
                }
            }
    });
    
    
  }
  ]);
