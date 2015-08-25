app.directive('disableAnimate', ['$animate', function( $animate ) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $animate.enabled(false, $element)
    }
  }
}]);
