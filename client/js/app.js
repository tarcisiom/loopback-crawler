angular
  .module('app', [
    'ui.router',
    'lbServices',
    'uiGmapgoogle-maps'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('estradas', {
        url: '/estradas',
        templateUrl: 'views/all-estradas.html',
        controller: 'EstradasController'
      })
      .state('sismos', {
        url: '/sismos',
        templateUrl: 'views/sismos.html',
        controller: 'SismosController'
      })
      .state('temperaturas', {
        url: '/temperaturas',
        templateUrl: 'views/temperaturas.html',
        controller: 'TempsController'
      })
      .state('map', {
        url: '/map',
        templateUrl: 'views/map.html',
        controller: 'MapController'
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpController',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      });
    // $urlRouterProvider.otherwise('login');
  }]);
  
  