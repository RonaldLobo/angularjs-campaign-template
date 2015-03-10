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
  

