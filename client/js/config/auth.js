angular
    .module('app')
    .config(function (  $httpProvider) {

        // Intercept 401 responses and redirect to login screen
        $httpProvider.interceptors.push(function ($q, $location) {
        return {
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    // save the current location so that login can redirect back
                    $location.nextAfterLogin = $location.path();

                    if ($location.path() === '/login') {
                        console.log('401 while on login path');
                    } else {
                        if ($location.path() !== '/register') {
                            $location.path('/login');
                            
                        }
                    }
                }
                 
                return $q.reject(rejection);
            }
        };
    });
});

