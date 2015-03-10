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
