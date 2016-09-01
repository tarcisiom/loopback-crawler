angular
  .module('app')
  .factory('AuthService', ['User', '$q', '$rootScope', function( User, $q,$rootScope) {
    
    function login(email, password) {
      return User
        .login({email: email, password: password})
        .$promise
        .then(function(response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: email
          };
        }, function () {
            console.log('User.login() err', arguments);
        });
    }

    function logout() {
      return User
       .logout()
       .$promise
       .then(function() {
         $rootScope.currentUser = null;
       });
    }

    function register(email, password) {
      return User
        .create({
         email: email,
         password: password
       })
       .$promise;
    }

    function ensureHasCurrentUser(cb){
      if ($rootScope.currentUser) {
        console.log('Using cached current user.');
      }
      cb($rootScope.currentUser);
    }

    return {
      login: login,
      logout: logout,
      register: register,
      ensureHasCurrentUser: ensureHasCurrentUser
    };
    
     
  }]);
