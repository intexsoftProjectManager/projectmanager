'use strict';

angular.module('tms')
    .controller('LoginController', LoginController);

function LoginController($scope, $rootScope, Auth, $location, $state) {
  var vm = this;
  vm.error = {};
  vm.user = {};

  vm.login = function (form) {
    Auth.login('password', {
        'email': $scope.user.email,
        'password': $scope.user.password
      },
      function (err) {
        vm.errors = {};
        if (!err) {
          if ($rootScope.originalUrl && $rootScope.originalUrl !== '/login') {
            $location.path($rootScope.originalUrl);
            $rootScope.originalUrl = null;
          } else {
            $state.go('main');
          }
        } else {
          angular.forEach(err.errors, function (error, field) {
            form[field].$setValidity('mongoose', false);
            vm.errors[field] = error.type;
          });
          vm.error.other = err.message;
        }
      });
  };
}
