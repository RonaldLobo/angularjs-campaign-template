/* 
 * This config allow you to get values from the query string using locationProvider
 */

module.config(['$locationProvider', function($locationProvider){
    //$locationProvider.html5Mode(true);    
}]);


/* 
 * This config to add the SPA's routing 
 */



module.config(function($routeProvider) {
    $routeProvider
            .when('/', {
                    templateUrl : '/templates/holders/home.html',
                    controller  : 'InfoCtrl'
            })
            .when('/Home', {
                    templateUrl : '/templates/holders/home.html',
                    controller  : 'InfoCtrl'
            })
            .when('/Billing', {
                    templateUrl : '/templates/contents/billing.html',
                    controller  : 'CcCtrl'
            })
            .when('/Success', {
                    templateUrl : '/templates/contents/success.html',
                    controller  : 'SuccessCtrl'
            })
            .when('/Upsell', {
                    templateUrl : '/templates/contents/upsell.php',
                    controller  : 'UpCtrl'
            })
            .otherwise({
                    redirectTo: '/'
                  });
});

