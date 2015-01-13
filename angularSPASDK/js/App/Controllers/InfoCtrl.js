/* 
 * This is the Info/index Controller
 */


module.controller( 'InfoCtrl' , ['$scope','$window','$routeParams','$location','$sce','ServiceHandler','ServicePixel','AlertHandler','BakeCookie','ServiceDate','ServiceHit',
    function($scope,$window,$routeParams,$location,$sce,ServiceHandler,ServicePixel,AlertHandler,BakeCookie,ServiceDate,ServiceHit) {
      $scope.ver = $routeParams.ver || 1;
      if($location.search().redirected == 1){  // check if the user is here because a redirect
          AlertHandler.alert("You're here because this information is needed");
      }
      $scope.templates = { 
          header  : 'templates/headers/header.html',
          templateBill : 'templates/forms/billingTemplate.html',
          footer : 'templates/footers/footer.html',
          1 : 'templates/contents/index.html'
      };
      $scope.billinfo = {};
      $scope.billinfo.productTypeID = config.IndexBootstrap.ProductTypeID;
      $scope.billinfo.affiliate = $routeParams.aff;
      $scope.billinfo.subAffiliate = $routeParams.sub;
      $scope.billinfo.customField1 = $routeParams.click_id;
      $scope.billinfo.country = 'US';
      $scope.showEl = indexShowEl;
      $scope.save = function(info){ // fuction fired after submit form
        $("#button-submit").hide();
        $("#button-processing").show();
        jsonObj = JSON.stringify(info);
        ServiceHandler.post('createprospect',jsonObj)
        .then(function(response){
            if(response.data.State == 'Success'){
                info.ProspectID = response.data.Result.ProspectID;
                BakeCookie.set('billingInfo',info);
                internal = true;
                $window.location.href = "#/"+ config.siteFlow.two ;
            }
            else{
                $("#button-processing").hide();
                $("#button-submit").show();
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
