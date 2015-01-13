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