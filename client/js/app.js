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
        controller: 'EstradasController',
        authenticate: true
      })
      .state('sismos', {
        url: '/sismos',
        templateUrl: 'views/sismos.html',
        controller: 'SismosController',
        authenticate: false
      })
      .state('temperaturas', {
        url: '/temperaturas',
        templateUrl: 'views/temperaturas.html',
        controller: 'TempsController',
        authenticate: false
      })
      .state('map', {
        url: '/map',
        templateUrl: 'views/map.html',
        controller: 'MapController',
        authenticate: false
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
    $urlRouterProvider.otherwise('login');
  }])
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      // redirect to login page if not logged in
      if (next.authenticate && !$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('login');
      }
    });
  }]);
