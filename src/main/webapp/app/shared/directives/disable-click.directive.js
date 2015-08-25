app.directive('disableClick', ['$parse', function( $parse ) {
  return {
    restrict: 'C',
    link: function(scope, element, attrs) {
      $(element).on("click tap", function(e) {
        e.stopPropagation();
      })
    }
  }
}]);