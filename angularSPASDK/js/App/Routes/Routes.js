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
                    templateUrl : '/templates/holders/homeHolder.html',
                    controller  : 'InfoCtrl'
            })
            .when('/{ver}', {   
                    templateUrl : '/templates/holders/homeHolder.html',
                    controller  : 'InfoCtrl'
            })
            .when('/Billing', {
                    templateUrl : '/templates/contents/billing.html',
                    controller  : 'CcCtrl'
            })
            .when('/success', {
                    templateUrl : '/templates/contents/success.html',
                    controller  : 'SuccessCtrl'
            })
            .when('/upsell', {
                    templateUrl : '/templates/contents/upsell.php',
                    controller  : 'UpCtrl'
            })
            .otherwise({
                    redirectTo: '/'
                  });
});

