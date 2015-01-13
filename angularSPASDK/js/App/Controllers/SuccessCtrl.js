/* 
 * This is the Controller for the CC Page
 */

module.controller( 'SuccessCtrl' , function($scope) {
      $scope.templates = { header  : 'templates/headers/header.html',
                          footer : 'templates/footers/footer.html',
                          content : 'templates/contents/success.html'
                      };
                      
                      $scope.status = 'ready';
});
  

