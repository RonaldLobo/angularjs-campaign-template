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
      if(billingInfo == undefined) $window.location.href = "#/?redirected=1"+'&aff='+aff+'&sub='+sub; // check if the user went through the correct order 
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
  

