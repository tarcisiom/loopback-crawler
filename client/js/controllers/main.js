angular
  .module('app')
  .controller('MainController',  ['$scope','$state','AuthService', 'User','$rootScope' ,
  function($scope, $state, AuthService, User, $rootScope) {
       
    $scope.refreshCurrentUser = function () {
          User.getCurrent().$promise.then(function(res) {
            $rootScope.currentUser = res;
          }, function(err) {
            
          });
          
    }

    
    
    AuthService.ensureHasCurrentUser(function () {
      $scope.refreshCurrentUser();
    });
    
    

  }
    
  ]);
  
