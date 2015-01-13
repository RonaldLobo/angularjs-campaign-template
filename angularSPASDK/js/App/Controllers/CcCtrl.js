/* 
 * This is the Controller for the CC Page
 */

module.controller( 'CcCtrl' , function($scope,$locale,$routeParams,$window,ServiceHandler,ServicePixel,AlertHandler,BakeCookie,encrypt,ServiceCvv,ServiceCc,ServiceDate) {
      billingInfo = BakeCookie.get('billingInfo');
      $scope.ver = $routeParams.ver || 1;
      $scope.showEl = orderShowEl;
      $scope.showElOp = orderShowElOp;
      $scope.templates = { 
          header  : 'templates/headers/header.html',
          templateCC : 'templates/forms/ccTemplate.html',
          footer : 'templates/footers/footer.html',
          1 : 'templates/contents/billing.html',
          content2 : 'templates/contents/step2-order.html'};
      $scope.ccinfo = {};
      $scope.currentYear = new Date().getFullYear();
      $scope.currentMonth = new Date().getMonth() + 1;
      $scope.months = $locale.DATETIME_FORMATS.MONTH;
      if(billingInfo == undefined && !orderShowEl.shippingForm) $window.location.href = "#/?redirected=1"; // check if the user went through the correct order 
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
      $scope.ccinfo.affiliate = $routeParams('aff') || '';
      $scope.ccinfo.subAffiliate = $routeParams('sub') || '';
      $scope.ccinfo.prospectID = billingInfo.ProspectID;
      $scope.ccinfo.description = orderSettings.description;
      $scope.save = function(){  // save function, called when submit
        $("#button-processing").show();
        $("#button-submit").hide();
        var oldCC = $scope.ccinfo.creditCard; 
        $scope.ccinfo.creditCard = encrypt.encryptData(oldCC);
        jsonObj = JSON.stringify($scope.ccinfo);
        ServiceHandler.post('CreateSubscription',jsonObj
        ).then(function(response){
            if(response.data.State == 'Success' || response.data.Info == 'Test charge. ERROR'){
                internal = true;
                $window.location.href = "#/"+config.siteFlow.three;
            }
            else{
                $("#button-processing").hide();
                $("#button-submit").show();
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
  

