
/* 
 * This function allow us to load JS code from templates using type="text/javascript-lazy"
 */

/*global angular */
(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      }
    };
  });

}(angular));

/* 
 * Global Module for all the app
 */

angular.module('HashBangURLs', []).config(['$locationProvider', function($location) {
  $location.hashPrefix('!');
}]);

var module = angular.module('app',['ngCookies','ngRoute','HashBangURLs']);

module.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) 
      {
        if (attr.type==='text/javascript-lazy') 
        {
          var s = document.createElement("script");
          s.type = "text/javascript";                
          var src = elem.attr('src');
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
        }
      }
    };
  });



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


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.filter( 'range', function() {
      var filter = 
        function(arr, lower, upper) {
          for (var i = lower; i <= upper; i++) arr.push(i)
          return arr
        }
      return filter
    } );
    
    
//    Unsafe html to safe
module.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);



/* 
 * This Directive checks the Credit Card expiration 
 * Only needs the dropdowns with the names: ccinfo.expMonth and ccinfo.expYear
 */

module.directive( 'cardExpiration' , function(AlertHandler){
      var directive =
        { require: 'ngModel'
        , link: function(scope, elm, attrs, ctrl,$event){
            scope.$watch('[ccinfo.expMonth,ccinfo.expYear]',function(){
                if(scope.ccinfo.expMonth != '' && scope.ccinfo.expYear != ''){
                    today = new Date();
                    selected = new Date();
                    selected.setMonth(scope.ccinfo.expMonth);
                    selected.setYear(scope.ccinfo.expYear)
                    if(today >= selected){
                        AlertHandler.alert('Please select a valid date!');
                        scope.ccinfo.expYear = '';
                        scope.ccinfo.expMonth = '';
                        return false;
                    }
                }
              return true
            },true)
          }
        }
      return directive
      });
      
      
/* 
 * This Directive allow us to include html pages without the need of a controller 
 * Used in the index.html to include header and footer
 */    
      
module.directive('staticInclude', ['$http','$templateCache','$compile','$timeout',function($http, $templateCache, $compile,timer) {
    return function(scope, element, attrs) {
        timer(function(){
            var templatePath = attrs.staticInclude;
            $http.get(templatePath, { cache: $templateCache }).success(function(response) {
                var contents = element.html(response).contents();
                $compile(contents)(scope);
            });
        },'1500');
    };
}]);


/* 
 * This Directive prevents the number insertion  
 * add onlyDigits to input
 */  

module.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});
/* 
 * This Factory Handles all the alerts of the app
 */


module.factory('AlertHandler', function(){
    return {
        alert : function(msg){
            jError(
                "<div>We are sorry but we could not process your request.<br/><h2>"+msg+"</h2>Please correct and try again.</div>",
                {
                    autoHide : true, // added in v2.0
                    TimeShown : 3000,
                    HorizontalPosition : 'center',
                    onCompleted : function(){ // added in v2.0

                    }
                }
            );
        }
    }
});


/* 
 * This Factory Handles every Ajax Call in the app calling out controller.php
 */

module.factory('ServiceHandler', ['$http',function($http){
    return {
        post : function(action,params){
            return $http.post('TriangleCRM/Controller.php', {
                action : action,
                data : params
            });
        }
    }
}]);

/* 
 * This Factory Handles every cookie set or get
 */

module.factory('BakeCookie', function($cookieStore){
    return {
        set : function(name, data){
            $cookieStore.put(name,data);
        },
        remove: function(name){
            $cookieStore.remove(name);
        },
        get: function(name){
            return $cookieStore.get(name);
        }
    }
});

/* 
 * This Factory encrypts the CC number before sending it to the server
 */

module.factory('encrypt', function(){
    return {
        encryptData: function(toencrypt){
            var $pem="-----BEGIN PUBLIC KEY-----\
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAM1RXGYKyXlCGcGvFYeNCD+yzVAOoK+w\
2awyE6vOCSqhR0pAWFgpWOuwbrL5M78PILmZc85ipbzoz6Vtv4IvYJUCAwEAAQ==\
-----END PUBLIC KEY-----";
        var $key = RSA.getPublicKey($pem);
        return RSA.encrypt(toencrypt,$key);
        }
    };
});

/* 
 * This Factory get the params from the query string
 */


module.factory('ParameterByName', function(){
    return {
        get : function(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
    }
});

/* 
 * This Factory handles the pixel code
 */

module.factory('ServicePixel', ['$http','$routeParams',function($http,$routeParams){
    return {
        get : function(pageTypeID,prospectID){
            var getPixel = {};
            getPixel.affiliate = $routeParams.aff || '';
            getPixel.clickId = $routeParams.click_id || '';
            getPixel.pageTypeID = pageTypeID;
            getPixel.prospectID = prospectID;
            jsonObj = JSON.stringify(getPixel);
            return $http.post('TriangleCRM/Controller.php', {
                action : 'FireAffiliatePixel',
                data : jsonObj
            });
        }
    }
}]);

/* 
 * This Factory handles the hit code
 */

module.factory('ServiceHit', ['$routeParams',function($routeParams){
    return {
        get : function(pageId,campaignId){
            var hit =  "http://"+config.general.instance+".trianglecrm.com/pixel/hit.js?aff="+$routeParams.aff+"&sub="+$routeParams.sub+"&pid="+pageId+"&cid="+campaignId;
            return hit;
        }
    }
}]);


/* 
 * This Factory handles the the cvv check
 */

module.factory('ServiceCvv', function(){
    return {
        get : function(type,cvv){
            var msg = '';
            if(type==undefined){
                msg ='Please select a Card Type first';
            }
            else{
                if(cvv == undefined){
                }
                else{
                    if(type==1){
                        if(cvv.toString().length != 4)
                            msg ='The CVV number for AMEX should have 4 digits';
                    }
                    else{
                        if(cvv.toString().length != 3)
                            msg = 'The CVV number for Visa, MasterCard and Discover should have 3 digits';
                    }
                }
            }
            return msg;
        }
    }
});

/* 
 * This Factory handles the the cvv check
 */

module.factory('ServiceCvv', function(){
    return {
        get : function(type,cvv){
            var msg = '';
            if(type==undefined){
                msg ='Please select a Card Type first';
            }
            else{
                if(cvv == undefined){
                }
                else{
                    if(type==1){
                        if(cvv.toString().length != 4)
                            msg ='The CVV number for AMEX should have 4 digits';
                    }
                    else{
                        if(cvv.toString().length != 3)
                            msg = 'The CVV number for Visa, MasterCard and Discover should have 3 digits';
                    }
                }
            }
            return msg;
        }
    }
});

module.factory('ServiceCc', function(){
    return {
        get : function(type,creditCard){
            var msg = '';
            if(type == undefined){
                msg = 'Please select a Card Type first';
            }
            else{
                if(creditCard == undefined){
                    
                }
                else{
                    if(type == 1){
                        if(creditCard.toString().length != 15)
                            msg = 'The credit card number for AMEX should have 15 digits';
                    }
                    else{
                        if(creditCard.toString().length != 16)
                            msg = 'The credit card number for Visa, MasterCard and Discover should have 15 digits';
                    }
                }
            }
            return msg;
        }
    }
});

module.factory('ServiceDate', function(){
    return {
        get : function(days){
            var dayNames = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");    
            var monthNames = new Array("January","February","March","April","May","June","July","August","September","October","November","December"); 
            var now = new Date();   
            now.setDate(now.getDate() + days);   
            var nowString =  dayNames[now.getDay()] + ", " + monthNames[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();   
            return nowString;
        }
    }
});
/* 
 * This is the Controller for the CC Page
 */

module.controller( 'CcCtrl' , function($scope,$locale,$routeParams,$window,$sce,ServiceHandler,ServicePixel,AlertHandler,BakeCookie,encrypt,ServiceCvv,ServiceCc,ServiceDate) {
      billingInfo = BakeCookie.get('billingInfo');
      ver = $routeParams.ver || 0;
      orderSettings = config[ver].billing;
      downSell = orderSettings.downsell || '';
      downSellImg = orderSettings.downSellImg || '';
      aff = $routeParams.aff || '';
      sub = $routeParams.sub || '';
      $scope.showEl = orderSettings;
      $scope.templates = { templateCC : 'templates/forms/ccTemplate.html'}
      $scope.ccinfo = {};
      $scope.currentYear = new Date().getFullYear();
      $scope.currentMonth = new Date().getMonth() + 1;
      $scope.months = $locale.DATETIME_FORMATS.MONTH;
      if(billingInfo == undefined) $window.location.href = "#/?redirected=1&aff="+aff+'&sub='sub; // check if the user went through the correct order 
      $scope.ccinfo.trialPackageID = orderSettings.trialPackageID;
      $scope.ccinfo.chargeForTrial = orderSettings.chargeForTrial;
      $scope.ccinfo.planID = orderSettings.planID;
      $scope.ccinfo.campaignID = orderSettings.campaign_id;
      $scope.ccinfo.firstName = billingInfo.firstName;
      $scope.ccinfo.lastName = billingInfo.lastName;
      $scope.ccinfo.address1 = billingInfo.address1;
      $scope.ccinfo.address2 = billingInfo.address2 || '';
      $scope.ccinfo.city = billingInfo.city;
      $scope.ccinfo.state = billingInfo.state;
      $scope.ccinfo.zip = billingInfo.zip;
      $scope.ccinfo.country = billingInfo.country;
      $scope.ccinfo.phone = billingInfo.phone;
      $scope.ccinfo.email = billingInfo.email;
      $scope.ccinfo.sendConfirmationEmail = orderSettings.sendConfirmationEmail;
      $scope.ccinfo.affiliate = $routeParams.aff || '';
      $scope.ccinfo.subAffiliate = $routeParams.sub || '';
      $scope.ccinfo.prospectID = billingInfo.ProspectID;
      $scope.ccinfo.description = orderSettings.description;
      function getSecondPart(str) {
         return str.split('<Message>')[1];
      }
      function getFirstPart(str) {
         return str.split('</Message>')[0];
      }
      $scope.save = function(){  // save function, called when submit
        $("#button-processing").show();
        $("#button-submit").hide();
        var oldCC = $scope.ccinfo.creditCard; 
        oldCC = oldCC.toString().replace(/-/g,'');
        $scope.ccinfo.creditCard = encrypt.encryptData(oldCC);
        var ccUsed = {
                  creditCard : $scope.ccinfo.creditCard,
                  productID : orderSettings.projectID
              }
        ServiceHandler.post('IsCreditCardDupe',ccUsed
        ).then(function(response){
            if(response.data.State == 'Success' || response.data.Info == 'Test charge. ERROR'){
                jsonObj = JSON.stringify($scope.ccinfo);
                ServiceHandler.post('CreateSubscription',jsonObj
                ).then(function(response){
                    if(response.data.State == 'Success' || response.data.Info == 'Test charge. ERROR'){
                        BakeCookie.set('ccInfo',info);
                        internal = true;
                        $window.location.href = orderSettings.successRedirect;
                    }
                    else{
                        $scope.proccessing = false;
                        $scope.submitBtn = true;
                        $scope.ccinfo.creditCard = oldCC;
                        AlertHandler.alert(response.data.Info);
                    }
                });
            }
            else{
                $("#button-processing").hide();
                $("#button-submit").show();
                $scope.ccinfo.creditCard = oldCC;
                AlertHandler.alert('This Credit Card is a dupe in our system.');
            }
        });
        return false;
      };
      $scope.typeChange = function(){
            var type = $scope.ccinfo.paymentType;
            if(type == 1){
                $('#cc_number').attr('pattern','{15}');
                $('#cc_number').attr('maxlength','15');
                $("#cc_number").mask("9999-999999-99999");
                $('#cc_cvv').attr('pattern','[0-9]{4}');
                $("#cc_cvv").mask("9999");
                $('#cc_cvv').attr('maxlength','4');
            }
            else{
                $('#cc_number').attr('pattern','{13,16}');
                $('#cc_number').attr('maxlength','16');
                $("#cc_number").mask("9999-9999-9999-9999");
                $('#cc_cvv').attr('pattern','[0-9]{3}');
                $("#cc_cvv").mask("999");
                $('#cc_cvv').attr('maxlength','3');
            }
      };
      $scope.getDate = function(days) {  
	 return ServiceDate.get(days);
       };
       $scope.ccCheck = function(){
            var msg = ServiceCc.get($scope.ccinfo.paymentType,$('#cc_number').val());
            if(msg){
                AlertHandler.alert(msg);
            }
     };
     $scope.cvvCheck = function(){
        var msg = ServiceCvv.get($scope.ccinfo.paymentType,$('#cc_cvv').val());
        if(msg){
            AlertHandler.alert(msg);
        }
     };
     ServicePixel.get(pageId,billingInfo.ProspectID).then(function(response){$scope.pixel = response.data.Result;});
     $scope.scripts = {script:{src: $sce.trustAsResourceUrl(ServiceHit.get(pageId,''))}};
     $scope.status = 'ready';
    });
  


/* 
 * This is the Info/index Controller
 */


module.controller( 'InfoCtrl' , ['$scope','$window','$routeParams','$location','$sce','ServiceHandler','ServicePixel','AlertHandler','BakeCookie','ServiceDate','ServiceHit',
    function($scope,$window,$routeParams,$location,$sce,ServiceHandler,ServicePixel,AlertHandler,BakeCookie,ServiceDate,ServiceHit) {
      if($location.search().redirected == 1){  // check if the user is here because a redirect
          AlertHandler.alert("You're here because this information is needed");
      }
      $scope.templates = { templateBill : 'templates/forms/billingTemplate.html' };
      $scope.billinfo = {};
      $scope.billinfo.productTypeID = indexInfo.ProductTypeID;
      $scope.billinfo.affiliate = $routeParams.aff;
      $scope.billinfo.subAffiliate = $routeParams.sub;
      $scope.billinfo.customField1 = $routeParams.click_id;
      $scope.billinfo.country = indexInfo.selectedCountry || 'US';
      $scope.showEl = indexInfo;
      $scope.save = function(info){ // fuction fired after submit form
        $scope.proccessing = true;
        $scope.submitBtn = false;
        jsonObj = JSON.stringify(info);
        ServiceHandler.post('createprospect',jsonObj)
        .then(function(response){
            if(response.data.State == 'Success'){
                info.ProspectID = response.data.Result.ProspectID;
                BakeCookie.set('billingInfo',info);
                internal = true;
                $window.location.href = indexInfo.successRedirect;
            }
            else{
                $scope.proccessing = false;
                $scope.submitBtn = true;
                AlertHandler.alert(response.data.Info);
            }
        });
        return false;
      };
      $scope.getDate = function(days) {  
	 return ServiceDate.get(days);
       };
       ServicePixel.get(pageId,'').then(function(response){$scope.pixel = response.data.Result});
       $scope.scripts = {script:{src: $sce.trustAsResourceUrl(ServiceHit.get(pageId,''))}};
       $scope.status = 'ready';
    }]);

/* 
 * This is the Controller for the CC Page
 */

module.controller( 'SuccessCtrl' , function($scope,$sce,BakeCookie,ServicePixel,ServiceHit) {
    $scope.billingInfo = BakeCookie.get('billingInfo');
    $scope.name = $scope.billingInfo.firstName;
    console.log($scope.billingInfo.firstName);
    if($scope.billingInfo == undefined) $window.location.href = "#/?redirected=1";
    ServicePixel.get(pageId,$scope.billingInfo.ProspectID).then(function(response){$scope.pixel = response.data.Result});
    $scope.scripts = {script:{src: $sce.trustAsResourceUrl(ServiceHit.get(pageId,''))}};
    $scope.status = 'ready';
});
  


/* 
 * This is the Controller for the CC Page
 */

module.controller( 'UpCtrl' , function($scope,$locale,$routeParams,$window,ServiceCvv,ServiceDate,ServiceCc,ServiceHandler,AlertHandler,BakeCookie,encrypt,ServicePixel) {
      billingInfo = BakeCookie.get('billingInfo');
      if(billingInfo == undefined) $window.location.href = "#/?redirected=1"; // check if the user went through the correct order 
      ccInfo = BakeCookie.get('ccInfo');
      if(ccInfo == undefined) $scope.showCc = true;
      $scope.templates = { templateUpsell : 'templates/forms/upsellTemplate.html'};
      $scope.up = {};
      $scope.showCc = false;
      $scope.currentYear = new Date().getFullYear();
      $scope.currentMonth = new Date().getMonth() + 1;
      $scope.months = $locale.DATETIME_FORMATS.MONTH;
      $scope.up.amount = upsellSettings.amount;
      $scope.up.shipping = upsellSettings.shipping;
      $scope.up.productTypeID = upsellSettings.productTypeID;
      $scope.up.productID = upsellSettings.productID;
      $scope.up.campaignID = upsellSettings.campaign_id;
      $scope.up.firstName = billingInfo.firstName;
      $scope.up.lastName = billingInfo.lastName;
      $scope.up.address1 = billingInfo.address1;
      $scope.up.address2 = billingInfo.address2 || '';
      $scope.up.city = billingInfo.city;
      $scope.up.state = billingInfo.state;
      $scope.up.zip = billingInfo.zip;
      $scope.up.country = billingInfo.country;
      $scope.up.phone = billingInfo.phone;
      $scope.up.email = billingInfo.email;
      $scope.up.paymentType = ccInfo.paymentType;
      $scope.up.creditCard = ccInfo.creditCard;
      $scope.up.cvv = ccInfo.cvv;
      $scope.up.expMonth = ccInfo.expMonth;
      $scope.up.expYear = ccInfo.expYear;
      $scope.up.sendConfirmationEmail = upsellSettings.sendConfirmationEmail;
      $scope.up.affiliate = $routeParams.aff || '';
      $scope.up.subAffiliate = $routeParams.sub || '';
      $scope.up.customField1 = $routeParams.click_id || '';
      $scope.up.prospectID = billingInfo.ProspectID;
      $scope.up.description = upsellSettings.description;
      $scope.save = function(){  // save function, called when submit
        $scope.proccessing = true;
        $scope.submitBtn = false;
        var oldCC = $scope.up.creditCard; 
        oldCC = oldCC.toString().replace(/-/g,'');
        $scope.up.creditCard = encrypt.encryptData(oldCC);
        jsonObj = JSON.stringify($scope.up);
        ServiceHandler.post('Charge',jsonObj
        ).then(function(response){
            if(response.data.State == 'Success' || response.data.Info == 'Test charge. ERROR'){
                internal = true;
                $window.location.href = upsellSettings.successRedirect;
            }
            else{
                $scope.proccessing = true;
                $scope.submitBtn = false;
                $scope.ccinfo.creditCard = oldCC;
                AlertHandler.alert(response.data.Info);
            }
        });
        return false;
      };
      $scope.typeChange = function(){
            var type = $scope.ccinfo.paymentType;
            if(type == 1){
                $('#cc_number').attr('pattern','{15}');
                $('#cc_number').attr('maxlength','15');
                $("#cc_number").mask("9999-999999-99999");
                $('#cc_cvv').attr('pattern','[0-9]{4}');
                $("#cc_cvv").mask("9999");
                $('#cc_cvv').attr('maxlength','4');
            }
            else{
                $('#cc_number').attr('pattern','{13,16}');
                $('#cc_number').attr('maxlength','16');
                $("#cc_number").mask("9999-9999-9999-9999");
                $('#cc_cvv').attr('pattern','[0-9]{3}');
                $("#cc_cvv").mask("999");
                $('#cc_cvv').attr('maxlength','3');
            }
      };
      $scope.getDate = function(days) {  
	 return ServiceDate.get(days);
       };
       $scope.ccCheck = function(){
            var msg = ServiceCc.get($scope.ccinfo.paymentType,$('#cc_number').val());
            if(msg){
                AlertHandler.alert(msg);
            }
     };
     $scope.cvvCheck = function(){
        var msg = ServiceCvv.get($scope.ccinfo.paymentType,$('#cc_cvv').val());
        if(msg){
            AlertHandler.alert(msg);
        }
     };
     ServicePixel.get(pageId,billingInfo.ProspectID).then(function(response){$scope.pixel = response.data.Result});
     $scope.status = 'ready';
    });
  

