angular
  .module('app')
  .controller('MainController',  ['$scope','$state','AuthService', 'User','$rootScope' ,
  function($scope, $state, AuthService, User, $rootScope) {
       
    $scope.refreshCurrentUser = function () {
        $rootScope.currentUser  = User.getCurrent();
    }

    
   /*
    AuthService.ensureHasCurrentUser(function () {
      
      $scope.refreshCurrentUser();
    });
  */

    }
    
  ]);
  
