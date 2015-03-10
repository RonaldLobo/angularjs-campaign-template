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
  

