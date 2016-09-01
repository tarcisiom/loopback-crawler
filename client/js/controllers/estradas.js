angular
  .module('app')
  .controller('EstradasController',['$scope', 'Estrada',   function($scope, Estrada 
     ) {
    $scope.sortType     = 'Tipo'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchBar   = '';     // set the default search/filter 

    $scope.estradas = Estrada.find({
            filter: {"include":"distrito"}
    });

    
  }
  ]);
