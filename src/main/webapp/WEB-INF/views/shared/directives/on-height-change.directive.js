'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.directive('onHeightChange', function ($parse, $timeout) {
  return {
    restrict: 'A',
    replace: false,
    link: function ($scope, $el, $attr) {
      $scope.$watch(
        function () { return $el[0].offsetHeight },
        function (newValue, oldValue) {
            var expressionHandler = $parse($attr.onHeightChange);
            $timeout(function(){
              expressionHandler($scope)
            }, 500);
        }
      );
    }
  };
});
